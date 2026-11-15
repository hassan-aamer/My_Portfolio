/**
 * Interactive 3D Fibonacci Lattice Technology Sphere.
 * Positions interactive DOM buttons in real 3D coordinates with pointer-drag inertia.
 */
(function (global) {
    'use strict';

    const { clamp, buildFibonacciSphere, rotatePoint3D } = global.Math3D;

    class TechSphere3D {
        /**
         * @param {HTMLElement} container
         * @param {Array<{label: string, domain: string, weight: number}>} tags
         * @param {(tag: object) => void} onSelectTag
         */
        constructor(container, tags, onSelectTag) {
            this.container = container;
            this.tags = tags;
            this.onSelectTag = onSelectTag;

            this.rotX = 0.25;
            this.rotY = 0;
            this.velX = 0.0022;
            this.velY = 0.0055;
            this.isDragging = false;
            this.dragMoved = false;
            this.isVisible = true;
            this.isTabHidden = document.hidden;
            this.ecoMode = false;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.lastPointer = { x: 0, y: 0 };
            this.radius = 155;
            this.nodes = [];
            this.rafId = null;

            this._tick = this._render.bind(this);
            this._init();
        }

        _init() {
            if (!this.container || !this.tags.length) return;
            this._updateRadius();

            const points = buildFibonacciSphere(this.tags.length, 1);
            this.container.innerHTML = '';

            this.nodes = this.tags.map((tag, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'sphere-tag';
                button.textContent = tag.label;
                button.dataset.domain = tag.domain;
                button.setAttribute('aria-label', `${tag.label} — highlight skill domain`);
                button.addEventListener('click', (e) => {
                    if (this.dragMoved) {
                        e.preventDefault();
                        return;
                    }
                    this._setActiveTag(button);
                    if (this.onSelectTag) {
                        this.onSelectTag(tag);
                    }
                });
                this.container.appendChild(button);
                return {
                    el: button,
                    tag: tag,
                    unit: points[index]
                };
            });

            this._bindEvents();
            this._render();
        }

        _setActiveTag(activeBtn) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodes[i].el.classList.toggle('is-selected', this.nodes[i].el === activeBtn);
            }
        }

        _updateRadius() {
            const rect = this.container.getBoundingClientRect();
            const size = Math.min(rect.width || 360, rect.height || 360);
            this.radius = clamp(size * 0.33, 82, 172);
        }

        setEcoMode(enabled) {
            this.ecoMode = Boolean(enabled);
        }

        _syncAnimationState() {
            const shouldRun = this.isVisible && !this.isTabHidden;
            if (shouldRun && !this.rafId) {
                this._render();
            } else if (!shouldRun && this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }

        _bindEvents() {
            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver(() => this._updateRadius());
                this.resizeObserver.observe(this.container);
            } else {
                window.addEventListener('resize', () => this._updateRadius(), { passive: true });
            }

            document.addEventListener('visibilitychange', () => {
                this.isTabHidden = document.hidden;
                this._syncAnimationState();
            });

            this.container.addEventListener('pointerdown', (e) => {
                this.isDragging = true;
                this.dragMoved = false;
                this.lastPointer = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('pointermove', (e) => {
                if (!this.isDragging) return;
                const dx = e.clientX - this.lastPointer.x;
                const dy = e.clientY - this.lastPointer.y;
                if (Math.hypot(dx, dy) > 6) {
                    this.dragMoved = true;
                }
                this.velY = dx * 0.0018;
                this.velX = -dy * 0.0018;
                this.rotY += this.velY * 2.2;
                this.rotX += this.velX * 2.2;
                this.lastPointer = { x: e.clientX, y: e.clientY };
            }, { passive: true });

            const stopDragging = () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                // Defer resetting dragMoved so the immediate synthetic click is still gated,
                // while subsequent keyboard Enter/Space activations on tags remain enabled.
                setTimeout(() => {
                    this.dragMoved = false;
                }, 0);
            };

            window.addEventListener('pointerup', stopDragging, { passive: true });
            window.addEventListener('pointercancel', stopDragging, { passive: true });

            if (typeof IntersectionObserver !== 'undefined') {
                const observer = new IntersectionObserver((entries) => {
                    this.isVisible = entries[0] ? entries[0].isIntersecting : true;
                    this._syncAnimationState();
                }, { threshold: 0.05 });
                observer.observe(this.container);
            }
        }

        _render() {
            if (!this.isVisible || this.isTabHidden) {
                this.rafId = null;
                return;
            }

            if (!this.isDragging) {
                this.rotY += this.velY;
                this.rotX += this.velX;
                if (this.reducedMotion) {
                    this.velY *= 0.88;
                    this.velX *= 0.88;
                } else {
                    const baseY = this.ecoMode ? 0.0022 : 0.0042;
                    const baseX = this.ecoMode ? 0.0006 : 0.0012;
                    // Gentle baseline spin while damping user flick inertia
                    this.velY = this.velY * 0.96 + baseY * 0.04;
                    this.velX = this.velX * 0.96 + baseX * 0.04;
                }
            }

            const fov = 420;
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const world = rotatePoint3D(
                    {
                        x: node.unit.x * this.radius,
                        y: node.unit.y * this.radius,
                        z: node.unit.z * this.radius
                    },
                    this.rotX,
                    this.rotY,
                    0
                );

                const perspective = fov / (fov - world.z);
                const x = world.x * perspective;
                const y = world.y * perspective;
                const depthNorm = (world.z + this.radius) / (this.radius * 2);
                const scale = clamp((0.68 + depthNorm * 0.52) * node.tag.weight, 0.62, 1.35);
                const opacity = clamp(0.24 + depthNorm * 0.78, 0.24, 1);

                node.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
                node.el.style.opacity = opacity.toFixed(3);
                node.el.style.zIndex = String(Math.round(depthNorm * 100));
            }

            this.rafId = requestAnimationFrame(this._tick);
        }
    }

    global.TechSphere3D = TechSphere3D;
})(window);
