/**
 * Interactive Particle Network Background
 * Optimized for performance and "Clean Code" aesthetic
 */

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Configuration
        this.config = {
            particleColor: 'rgba(0, 255, 255, 0.5)', // Default Cyan
            lineColor: '0, 255, 255', // Base RGB to combine with dynamic opacity
            particleAmount: window.innerWidth < 768 ? 40 : 80, // Optimized count
            defaultSpeed: 0.5,
            currentSpeed: 0.5,
            variantSpeed: 1,
            linkRadius: 150,
            mouseRadius: 200
        };

        this.mouse = { x: -1000, y: -1000 };
        this.scrollSpeedMultiplier = 1;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.setupSectionObserver();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Re-optimize particle count on resize
        this.config.particleAmount = window.innerWidth < 768 ? 40 : 80;
    }

    createParticles() {
        if (!this.particles) {
            this.particles = [];
        }

        // Adjust particle count
        if (this.particles.length > this.config.particleAmount) {
            // Remove excess particles
            this.particles.length = this.config.particleAmount;
        } else {
            // Add new particles
            for (let i = this.particles.length; i < this.config.particleAmount; i++) {
                this.particles.push(new Particle(this.width, this.height, this.config));
            }
        }

        // Update bounds for all existing particles so they don't bounce out of frame
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.w = this.width;
            p.h = this.height;
            // Prevent getting trapped outside bounds if screen size decreased
            if (p.x > this.width) p.x = this.width;
            if (p.y > this.height) p.y = this.height;
        }
    }

    addEventListeners() {
        // Use ResizeObserver to reliably catch canvas resizing,
        // especially when restoring from a background tab where window.innerWidth can be incorrect.
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0 && (this.width !== width || this.height !== height)) {
                    this.width = width;
                    this.height = height;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.config.particleAmount = width < 768 ? 40 : 80;
                    this.createParticles();
                }
            }
        });
        resizeObserver.observe(this.canvas);

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('scroll', () => {
            // Slight acceleration on scroll
            this.scrollSpeedMultiplier = 1.5;
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.scrollSpeedMultiplier = 1;
            }, 200);
        });

        // Ensure particles are redrawn safely when tab becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.resize();
                this.createParticles();
            }
        });
    }

    setupSectionObserver() {
        const options = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateConfig('rgba(0, 255, 255, 0.5)', '0, 255, 255', 0.5);
                }
            });
        }, options);

        // Observe sections if they exist
        const sections = ['hero', 'about', 'projects', 'contact', 'project-details', 'ai-integration'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    updateConfig(pColor, lColor, speed) {
        // Smooth transition could be implemented here, but direct switch is more performant
        this.config.particleColor = pColor;
        this.config.lineColor = lColor;
        this.config.currentSpeed = speed;

        // Update existing particles color
        this.particles.forEach(p => p.color = pColor);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.scrollSpeedMultiplier, this.config.currentSpeed);
            this.particles[i].draw(this.ctx);
            this.linkParticles(this.particles[i], this.particles, i);
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    linkParticles(particle, particles, currentIndex) {
        // Start from currentIndex + 1 to avoid redundant lines and self-linking
        for (let i = currentIndex + 1; i < particles.length; i++) {
            const distance = particle.getDistance(particles[i]);

            if (distance < this.config.linkRadius) {
                // Opacity peaks at 0.15 for particle-particle links
                const opacity = (1 - (distance / this.config.linkRadius)) * 0.15;
                this.ctx.strokeStyle = `rgba(${this.config.lineColor}, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(particles[i].x, particles[i].y);
                this.ctx.stroke();
            }
        }

        // Link to mouse
        const mouseDist = Math.hypot(particle.x - this.mouse.x, particle.y - this.mouse.y);
        if (mouseDist < this.config.mouseRadius) {
            const opacity = 1 - (mouseDist / this.config.mouseRadius);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
        }
    }
}

class Particle {
    constructor(w, h, config) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5);
        this.vy = (Math.random() - 0.5);
        this.size = Math.random() * 2 + 1;
        this.w = w;
        this.h = h;
        this.color = config.particleColor;
    }

    update(scrollMultiplier, baseSpeed) {
        this.x += this.vx * baseSpeed * scrollMultiplier;
        this.y += this.vy * baseSpeed * scrollMultiplier;

        if (this.x < 0 || this.x > this.w) this.vx *= -1;
        if (this.y < 0 || this.y > this.h) this.vy *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    getDistance(p) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
});
