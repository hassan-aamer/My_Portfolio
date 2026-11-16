/**
 * Full-viewport pure-JS 3D background engine.
 * Renders a perspective infrastructure grid, a scroll-responsive 3D polyhedral
 * microservices core, orbiting nodes, and depth-sorted 3D telemetry particles.
 */
(function (global) {
    'use strict';

    const { clamp, lerp, rotatePoint3D, projectPoint3D } = global.Math3D;

    // Normalized icosahedron vertices and triangle edges for the 3D architectural core
    const PHI = (1 + Math.sqrt(5)) / 2;
    const RAW_ICO_VERTS = [
        [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
        [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
        [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
    ].map(([x, y, z]) => {
        const len = Math.hypot(x, y, z);
        return { x: x / len, y: y / len, z: z / len };
    });

    const ICO_EDGES = [
        [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
        [1, 5], [1, 7], [1, 8], [1, 9],
        [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
        [3, 4], [3, 6], [3, 8], [3, 9],
        [4, 5], [4, 9], [4, 11],
        [5, 9], [5, 11],
        [6, 7], [6, 8], [6, 10],
        [7, 8], [7, 10],
        [8, 9], [10, 11]
    ];

    const OCTA_VERTS = [
        { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
    ];

    const OCTA_EDGES = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2]
    ];

    const SECTION_PRESETS = {
        overview: { offsetX: 0.24, offsetY: -0.04, coreScale: 195, accent: [34, 211, 238], secondary: [16, 185, 129] },
        architecture: { offsetX: -0.28, offsetY: 0.08, coreScale: 155, accent: [245, 158, 11], secondary: [34, 211, 238] },
        experience: { offsetX: 0.3, offsetY: 0.02, coreScale: 170, accent: [16, 185, 129], secondary: [56, 189, 248] },
        projects: { offsetX: -0.25, offsetY: -0.06, coreScale: 185, accent: [34, 211, 238], secondary: [129, 140, 248] },
        skills: { offsetX: 0.0, offsetY: 0.12, coreScale: 210, accent: [129, 140, 248], secondary: [34, 211, 238] },
        credentials: { offsetX: 0.26, offsetY: -0.05, coreScale: 165, accent: [16, 185, 129], secondary: [245, 158, 11] },
        contact: { offsetX: 0.0, offsetY: -0.08, coreScale: 190, accent: [34, 211, 238], secondary: [16, 185, 129] }
    };

    class UniverseScene3D {
        /**
         * @param {HTMLCanvasElement} canvas
         */
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: true });
            this.width = 0;
            this.height = 0;
            this.dpr = 1;
            this.rafId = null;
            this.isPaused = false;
            this.ecoMode = false;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };
            this.scrollProgress = 0;
            this.activeSection = 'overview';

            this.state = {
                offsetX: SECTION_PRESETS.overview.offsetX,
                offsetY: SECTION_PRESETS.overview.offsetY,
                coreScale: SECTION_PRESETS.overview.coreScale,
                accent: [...SECTION_PRESETS.overview.accent],
                secondary: [...SECTION_PRESETS.overview.secondary],
                rotX: 0.35,
                rotY: 0.4
            };

            this.particles = [];
            this.satellites = this._createSatellites();

            this._handleResize = this._resize.bind(this);
            this._handlePointerMove = this._onPointerMove.bind(this);
            this._handleVisibility = this._onVisibilityChange.bind(this);
            this._tick = this._render.bind(this);

            this._init();
        }

        _init() {
            if (!this.ctx) return;
            this._resize();
            this._populateParticles();

            window.addEventListener('resize', this._handleResize, { passive: true });
            window.addEventListener('pointermove', this._handlePointerMove, { passive: true });
            document.addEventListener('visibilitychange', this._handleVisibility);

            this._render(0);
        }

        _createSatellites() {
            const count = 6;
            const list = [];
            for (let i = 0; i < count; i++) {
                list.push({
                    orbitRadius: 1.38 + (i % 3) * 0.24,
                    speed: (i % 2 === 0 ? 1 : -1) * (0.45 + i * 0.08),
                    phase: (Math.PI * 2 * i) / count,
                    tiltX: (i * 0.45) - 0.8,
                    tiltZ: (i * 0.62) - 0.5,
                    size: 3.2 + (i % 2) * 1.4
                });
            }
            return list;
        }

        _populateParticles() {
            const targetCount = this.ecoMode ? 48 : (this.width < 768 ? 65 : 115);
            this.particles = [];
            for (let i = 0; i < targetCount; i++) {
                this.particles.push(this._makeParticle(Math.random() * 1400 - 500));
            }
        }

        _makeParticle(zPos) {
            return {
                x: (Math.random() - 0.5) * 1900,
                y: (Math.random() - 0.5) * 1200,
                z: zPos,
                speedZ: 0.7 + Math.random() * 1.6,
                size: 1 + Math.random() * 2.1,
                tone: Math.random() > 0.35 ? 'primary' : 'secondary'
            };
        }

        _resize() {
            this.dpr = Math.min(window.devicePixelRatio || 1, this.ecoMode ? 1.25 : 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = Math.floor(this.width * this.dpr);
            this.canvas.height = Math.floor(this.height * this.dpr);
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        _onPointerMove(event) {
            if (this.width === 0 || this.height === 0) return;
            this.pointer.targetX = (event.clientX / this.width - 0.5) * 2;
            this.pointer.targetY = (event.clientY / this.height - 0.5) * 2;
        }

        _onVisibilityChange() {
            if (document.hidden) {
                this.isPaused = true;
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            } else {
                this.isPaused = false;
                if (!this.rafId) {
                    this._render(performance.now());
                }
            }
        }

        setSection(sectionId) {
            if (SECTION_PRESETS[sectionId]) {
                this.activeSection = sectionId;
            }
        }

        setScrollProgress(progress) {
            this.scrollProgress = clamp(progress, 0, 1);
        }

        setEcoMode(enabled) {
            this.ecoMode = Boolean(enabled);
            this._resize();
            this._populateParticles();
        }

        _rgba(rgb, alpha) {
            return `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${alpha})`;
        }

        _drawFloorGrid(timeSec, accentRgb) {
            const ctx = this.ctx;
            const cols = this.ecoMode ? 10 : 14;
            const rows = this.ecoMode ? 8 : 11;
            const spacingX = 155;
            const spacingZ = 140;
            const floorY = 270;
            const camera = {
                fov: 680,
                cameraZ: 520,
                centerX: this.width * 0.5 - this.pointer.x * 45,
                centerY: this.height * 0.68 - this.pointer.y * 28
            };
            const zScroll = (timeSec * (this.reducedMotion ? 0 : 42)) % spacingZ;

            ctx.lineWidth = 1;

            // Longitudinal depth lines
            for (let c = -cols / 2; c <= cols / 2; c++) {
                const x = c * spacingX;
                const near = projectPoint3D({ x: x, y: floorY, z: 220 }, camera);
                const far = projectPoint3D({ x: x, y: floorY, z: -rows * spacingZ }, camera);
                if (!near || !far) continue;

                const edgeFade = 1 - Math.abs(c) / (cols / 2 + 1);
                ctx.strokeStyle = this._rgba(accentRgb, 0.08 * edgeFade);
                ctx.beginPath();
                ctx.moveTo(near.x, near.y);
                ctx.lineTo(far.x, far.y);
                ctx.stroke();
            }

            // Transverse pulse lines
            for (let r = 0; r < rows; r++) {
                const z = 180 - r * spacingZ + zScroll;
                const left = projectPoint3D({ x: -(cols / 2) * spacingX, y: floorY, z: z }, camera);
                const right = projectPoint3D({ x: (cols / 2) * spacingX, y: floorY, z: z }, camera);
                if (!left || !right) continue;

                const depthFade = clamp(1 - r / rows, 0.04, 1);
                ctx.strokeStyle = this._rgba(accentRgb, 0.085 * depthFade);
                ctx.beginPath();
                ctx.moveTo(left.x, left.y);
                ctx.lineTo(right.x, right.y);
                ctx.stroke();
            }
        }

        _drawParticles(accentRgb, secondaryRgb) {
            const ctx = this.ctx;
            const camera = {
                fov: 650,
                cameraZ: 580,
                centerX: this.width * 0.5 - this.pointer.x * 55,
                centerY: this.height * 0.5 - this.pointer.y * 38
            };

            const speedFactor = this.reducedMotion ? 0 : (this.ecoMode ? 0.55 : 1);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.z += p.speedZ * speedFactor;
                if (p.z > 520) {
                    p.z = -900;
                    p.x = (Math.random() - 0.5) * 1900;
                    p.y = (Math.random() - 0.5) * 1200;
                }

                const proj = projectPoint3D(p, camera);
                if (!proj) continue;
                if (proj.x < -20 || proj.x > this.width + 20 || proj.y < -20 || proj.y > this.height + 20) continue;

                const alpha = clamp((p.z + 900) / 1400, 0.06, 0.55);
                const radius = clamp(p.size * proj.scale, 0.6, 3.2);
                const rgb = p.tone === 'primary' ? accentRgb : secondaryRgb;

                ctx.fillStyle = this._rgba(rgb, alpha);
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        _drawCorePolyhedron(timeSec, accentRgb, secondaryRgb) {
            const ctx = this.ctx;
            const isMobile = this.width < 900;
            const radiusScale = isMobile ? 0.72 : 1;
            const scale = this.state.coreScale * radiusScale;

            const camera = {
                fov: 760,
                cameraZ: 640,
                centerX: this.width * (0.5 + (isMobile ? 0 : this.state.offsetX)) - this.pointer.x * 32,
                centerY: this.height * (0.5 + this.state.offsetY) - this.pointer.y * 26
            };

            const rx = this.state.rotX + this.pointer.y * 0.25 + this.scrollProgress * 1.4;
            const ry = this.state.rotY + this.pointer.x * 0.35;

            // Project outer icosahedron vertices
            const outerProjected = RAW_ICO_VERTS.map((v) => {
                const rotated = rotatePoint3D(
                    { x: v.x * scale, y: v.y * scale, z: v.z * scale },
                    rx,
                    ry,
                    timeSec * 0.05
                );
                return projectPoint3D(rotated, camera);
            });

            // Draw outer wireframe edges
            ctx.lineWidth = 1.1;
            for (let i = 0; i < ICO_EDGES.length; i++) {
                const [aIdx, bIdx] = ICO_EDGES[i];
                const a = outerProjected[aIdx];
                const b = outerProjected[bIdx];
                if (!a || !b) continue;

                const avgDepth = (a.z + b.z) * 0.5;
                const alpha = clamp((avgDepth + scale) / (scale * 2), 0.1, 0.52);
                ctx.strokeStyle = this._rgba(accentRgb, alpha);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            // Draw glowing vertex nodes
            for (let i = 0; i < outerProjected.length; i++) {
                const pt = outerProjected[i];
                if (!pt) continue;
                const alpha = clamp((pt.z + scale) / (scale * 2), 0.2, 0.85);
                ctx.fillStyle = this._rgba(accentRgb, alpha);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 2.3 * pt.scale, 0, Math.PI * 2);
                ctx.fill();
            }

            // Inner counter-rotating octahedron core
            const innerScale = scale * 0.52;
            const innerProjected = OCTA_VERTS.map((v) => {
                const rotated = rotatePoint3D(
                    { x: v.x * innerScale, y: v.y * innerScale, z: v.z * innerScale },
                    -rx * 1.35,
                    -ry * 1.4,
                    0
                );
                return projectPoint3D(rotated, camera);
            });

            ctx.lineWidth = 1.25;
            for (let i = 0; i < OCTA_EDGES.length; i++) {
                const [aIdx, bIdx] = OCTA_EDGES[i];
                const a = innerProjected[aIdx];
                const b = innerProjected[bIdx];
                if (!a || !b) continue;
                ctx.strokeStyle = this._rgba(secondaryRgb, 0.42);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            // Orbiting service satellites linked to core center
            const centerProj = projectPoint3D({ x: 0, y: 0, z: 0 }, camera);
            if (!centerProj) return;

            for (let i = 0; i < this.satellites.length; i++) {
                const sat = this.satellites[i];
                const angle = sat.phase + timeSec * sat.speed;
                const rawOrbit = {
                    x: Math.cos(angle) * scale * sat.orbitRadius,
                    y: Math.sin(angle) * scale * sat.orbitRadius * 0.36,
                    z: Math.sin(angle) * scale * sat.orbitRadius
                };
                const tilted = rotatePoint3D(rawOrbit, sat.tiltX + rx * 0.3, ry * 0.2, sat.tiltZ);
                const proj = projectPoint3D(tilted, camera);
                if (!proj) continue;

                const satColor = i % 2 === 0 ? accentRgb : secondaryRgb;
                ctx.strokeStyle = this._rgba(satColor, 0.14);
                ctx.lineWidth = 0.85;
                ctx.beginPath();
                ctx.moveTo(centerProj.x, centerProj.y);
                ctx.lineTo(proj.x, proj.y);
                ctx.stroke();

                ctx.fillStyle = this._rgba(satColor, 0.85);
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, sat.size * proj.scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        _render(timestamp) {
            if (this.isPaused || !this.ctx) return;

            const timeSec = (timestamp || 0) * 0.001;
            const targetPreset = SECTION_PRESETS[this.activeSection] || SECTION_PRESETS.overview;

            // Smooth camera & color transitions
            this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.06);
            this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.06);

            this.state.offsetX = lerp(this.state.offsetX, targetPreset.offsetX, 0.045);
            this.state.offsetY = lerp(this.state.offsetY, targetPreset.offsetY, 0.045);
            this.state.coreScale = lerp(this.state.coreScale, targetPreset.coreScale, 0.05);

            for (let i = 0; i < 3; i++) {
                this.state.accent[i] = lerp(this.state.accent[i], targetPreset.accent[i], 0.05);
                this.state.secondary[i] = lerp(this.state.secondary[i], targetPreset.secondary[i], 0.05);
            }

            if (!this.reducedMotion) {
                const spinStep = this.ecoMode ? 0.0022 : 0.0038;
                this.state.rotY += spinStep;
                this.state.rotX = 0.32 + Math.sin(timeSec * 0.35) * 0.18;
            }

            this.ctx.clearRect(0, 0, this.width, this.height);

            // Subtle depth halo behind the 3D polyhedron
            const isMobile = this.width < 900;
            const glowX = this.width * (0.5 + (isMobile ? 0 : this.state.offsetX)) - this.pointer.x * 32;
            const glowY = this.height * (0.5 + this.state.offsetY) - this.pointer.y * 26;
            const halo = this.ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, this.state.coreScale * 1.9);
            halo.addColorStop(0, this._rgba(this.state.accent, 0.14));
            halo.addColorStop(0.5, this._rgba(this.state.secondary, 0.05));
            halo.addColorStop(1, 'rgba(5, 7, 12, 0)');
            this.ctx.fillStyle = halo;
            this.ctx.fillRect(0, 0, this.width, this.height);

            this._drawFloorGrid(timeSec, this.state.accent);
            this._drawParticles(this.state.accent, this.state.secondary);
            this._drawCorePolyhedron(timeSec, this.state.accent, this.state.secondary);

            this.rafId = requestAnimationFrame(this._tick);
        }
    }

    global.UniverseScene3D = UniverseScene3D;
})(window);
