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
            lineColor: 'rgba(0, 255, 255, 0.15)',
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
        this.particles = [];
        for (let i = 0; i < this.config.particleAmount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.config));
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

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
    }

    setupSectionObserver() {
        const options = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateConfig('rgba(0, 255, 255, 0.5)', 'rgba(0, 255, 255, 0.15)', 0.5);
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
            this.linkParticles(this.particles[i], this.particles);
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    linkParticles(particle, particles) {
        for (let i = 0; i < particles.length; i++) {
            const distance = particle.getDistance(particles[i]);

            if (distance < this.config.linkRadius) {
                const opacity = 1 - (distance / this.config.linkRadius);
                this.ctx.strokeStyle = this.config.lineColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('rgbaa', 'rgba');
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
