/**
 * Interactive 3D System Architecture Topology Visualizer.
 * Pure HTML5 Canvas + 3D projection engine enabling 360-degree drag orbit,
 * node hit-testing, and live animated distributed request flow traces.
 */
(function (global) {
    'use strict';

    const { clamp, lerp, rotatePoint3D, projectPoint3D } = global.Math3D;

    /**
     * Draw a subtle 3D wireframe cube around a projected node center for spatial depth.
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x:number,y:number,z:number}} worldPos
     * @param {number} halfSize
     * @param {number} rx
     * @param {number} ry
     * @param {object} camera
     * @param {string} strokeStyle
     */
    function drawNodeWireBox(ctx, worldPos, halfSize, rx, ry, camera, strokeStyle) {
        const offsets = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        const projected = offsets.map(([ox, oy, oz]) => {
            const localRotated = rotatePoint3D(
                { x: ox * halfSize, y: oy * halfSize, z: oz * halfSize },
                rx * 0.6,
                ry * 0.6,
                0
            );
            return projectPoint3D(
                {
                    x: worldPos.x + localRotated.x,
                    y: worldPos.y + localRotated.y,
                    z: worldPos.z + localRotated.z
                },
                camera
            );
        });

        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < edges.length; i++) {
            const a = projected[edges[i][0]];
            const b = projected[edges[i][1]];
            if (!a || !b) continue;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
    }

    class TopologyVisualizer3D {
        /**
         * @param {HTMLCanvasElement} canvas
         * @param {(node: object, topology: object) => void} onSelectNode
         */
        constructor(canvas, onSelectNode) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: true });
            this.onSelectNode = onSelectNode;

            this.topology = null;
            this.selectedNodeId = null;
            this.hoveredNodeId = null;
            this.projectedNodes = [];

            this.width = 640;
            this.height = 460;
            this.dpr = 1;

            this.rotX = 0.24;
            this.rotY = -0.35;
            this.velX = 0;
            this.velY = 0;
            this.cameraZ = 540;
            this.targetCameraZ = 540;
            this.autoOrbit = true;
            this.ecoMode = false;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.isVisible = true;
            this.isTabHidden = document.hidden;

            this.isDragging = false;
            this.dragMoved = false;
            this.lastPointer = { x: 0, y: 0 };

            this.packets = [];
            this.activeFlowNodeId = null;
            this.flowTimerIds = [];

            this.rafId = null;
            this._tick = this._render.bind(this);
            this._bindEvents();
        }

        _bindEvents() {
            this._resize();

            if (typeof ResizeObserver !== 'undefined') {
                this.resizeObserver = new ResizeObserver(() => this._resize());
                if (this.canvas.parentElement) {
                    this.resizeObserver.observe(this.canvas.parentElement);
                }
            } else {
                window.addEventListener('resize', () => this._resize(), { passive: true });
            }

            if (typeof IntersectionObserver !== 'undefined') {
                this.visibilityObserver = new IntersectionObserver(
                    (entries) => {
                        this.isVisible = entries[0] ? entries[0].isIntersecting : true;
                        this._syncAnimationState();
                    },
                    { threshold: 0.02 }
                );
                this.visibilityObserver.observe(this.canvas);
            }

            document.addEventListener('visibilitychange', () => {
                this.isTabHidden = document.hidden;
                this._syncAnimationState();
            });

            this.canvas.addEventListener('pointerdown', (e) => {
                this.isDragging = true;
                this.dragMoved = false;
                this.lastPointer = { x: e.clientX, y: e.clientY };
                if (typeof this.canvas.setPointerCapture === 'function' && e.pointerId !== undefined) {
                    try {
                        this.canvas.setPointerCapture(e.pointerId);
                    } catch (err) {
                        // Synthetic pointer events may not have an active pointerId.
                    }
                }
            });

            this.canvas.addEventListener('pointermove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const localX = e.clientX - rect.left;
                const localY = e.clientY - rect.top;

                if (this.isDragging) {
                    const dx = e.clientX - this.lastPointer.x;
                    const dy = e.clientY - this.lastPointer.y;
                    if (Math.hypot(dx, dy) > 4) {
                        this.dragMoved = true;
                    }
                    this.rotY += dx * 0.0085;
                    this.rotX = clamp(this.rotX + dy * 0.0085, -1.15, 1.15);
                    this.velY = dx * 0.0018;
                    this.velX = dy * 0.0012;
                    this.lastPointer = { x: e.clientX, y: e.clientY };
                    return;
                }

                const hit = this._hitTest(localX, localY);
                this.hoveredNodeId = hit ? hit.node.id : null;
                this.canvas.style.cursor = hit ? 'pointer' : 'grab';
            });

            const finishDrag = (e, allowClick) => {
                if (allowClick && !this.dragMoved) {
                    const rect = this.canvas.getBoundingClientRect();
                    const hit = this._hitTest(e.clientX - rect.left, e.clientY - rect.top);
                    if (hit) {
                        this.selectNode(hit.node.id);
                    }
                }
                this.isDragging = false;
                if (
                    e &&
                    e.pointerId !== undefined &&
                    typeof this.canvas.hasPointerCapture === 'function' &&
                    this.canvas.hasPointerCapture(e.pointerId)
                ) {
                    this.canvas.releasePointerCapture(e.pointerId);
                }
            };

            this.canvas.addEventListener('pointerup', (e) => finishDrag(e, true));
            this.canvas.addEventListener('pointercancel', (e) => finishDrag(e, false));

            this.canvas.addEventListener('pointerleave', () => {
                this.hoveredNodeId = null;
            });
        }

        _syncAnimationState() {
            const shouldRun = this.isVisible && !this.isTabHidden && Boolean(this.topology);
            if (shouldRun && !this.rafId) {
                this._render(performance.now());
            } else if (!shouldRun && this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }

        _resize() {
            const parent = this.canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const rawWidth = parent.clientWidth || rect.width;
            const rawHeight = parent.clientHeight || rect.height;
            const nextWidth = Math.max(280, Math.floor(rawWidth));
            const nextHeight = Math.max(340, Math.floor(rawHeight));
            const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

            if (nextWidth === this.width && nextHeight === this.height && nextDpr === this.dpr && this.canvas.width > 0) {
                return;
            }

            this.width = nextWidth;
            this.height = nextHeight;
            this.dpr = nextDpr;

            this.canvas.width = Math.floor(this.width * this.dpr);
            this.canvas.height = Math.floor(this.height * this.dpr);
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        _hitTest(px, py) {
            let best = null;
            let bestDist = Infinity;
            for (let i = this.projectedNodes.length - 1; i >= 0; i--) {
                const item = this.projectedNodes[i];
                const dist = Math.hypot(px - item.screen.x, py - item.screen.y);
                const hitRadius = Math.max(24, 28 * item.screen.scale);
                if (dist <= hitRadius && dist < bestDist) {
                    best = item;
                    bestDist = dist;
                }
            }
            return best;
        }

        setTopology(topology) {
            this.clearFlowTimers();
            this.topology = topology;
            this.packets = [];
            this.activeFlowNodeId = null;

            const defaultNode = topology.nodes[0];
            this.selectedNodeId = defaultNode ? defaultNode.id : null;
            if (defaultNode && this.onSelectNode) {
                this.onSelectNode(defaultNode, topology);
            }

            this._syncAnimationState();
            this.triggerFlow();
        }

        selectNode(nodeId) {
            if (!this.topology) return;
            const node = this.topology.nodes.find((n) => n.id === nodeId);
            if (!node) return;
            this.selectedNodeId = node.id;
            if (this.onSelectNode) {
                this.onSelectNode(node, this.topology);
            }
        }

        setAutoOrbit(enabled) {
            this.autoOrbit = Boolean(enabled);
        }

        setEcoMode(enabled) {
            this.ecoMode = Boolean(enabled);
        }

        zoomBy(delta) {
            this.targetCameraZ = clamp(this.targetCameraZ + delta, 360, 780);
        }

        resetView() {
            this.rotX = 0.24;
            this.rotY = -0.35;
            this.velX = 0;
            this.velY = 0;
            this.targetCameraZ = 540;
        }

        clearFlowTimers() {
            for (let i = 0; i < this.flowTimerIds.length; i++) {
                clearTimeout(this.flowTimerIds[i]);
            }
            this.flowTimerIds = [];
        }

        triggerFlow() {
            if (!this.topology || !this.topology.flowSequence) return;
            this.clearFlowTimers();
            this.packets = [];
            const seq = this.topology.flowSequence;

            for (let i = 0; i < seq.length - 1; i++) {
                const fromId = seq[i];
                const toId = seq[i + 1];
                const delay = i * 360;

                const timerId = setTimeout(() => {
                    this.activeFlowNodeId = fromId;
                    if (!this.isTabHidden && this.packets.length < 24) {
                        this.packets.push({
                            fromId: fromId,
                            toId: toId,
                            progress: 0,
                            speed: 0.032,
                            color: i % 2 === 0 ? '#22d3ee' : '#10b981'
                        });
                    }
                }, delay);
                this.flowTimerIds.push(timerId);
            }

            const endTimer = setTimeout(() => {
                this.activeFlowNodeId = seq[seq.length - 1];
                const clearTimer = setTimeout(() => {
                    this.activeFlowNodeId = null;
                }, 650);
                this.flowTimerIds.push(clearTimer);
            }, (seq.length - 1) * 360);
            this.flowTimerIds.push(endTimer);
        }

        _drawHexGrid(camera) {
            const ctx = this.ctx;
            const ringRadius = 215;
            const points = [];
            const segments = 24;
            for (let i = 0; i < segments; i++) {
                const a = (i / segments) * Math.PI * 2;
                const world = rotatePoint3D(
                    { x: Math.cos(a) * ringRadius, y: 155, z: Math.sin(a) * ringRadius },
                    this.rotX,
                    this.rotY,
                    0
                );
                const proj = projectPoint3D(world, camera);
                if (proj) points.push(proj);
            }
            if (points.length > 2) {
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }

        _render(timestamp) {
            if (!this.ctx || !this.topology || !this.isVisible || this.isTabHidden) {
                this.rafId = null;
                return;
            }

            const timeSec = (timestamp || 0) * 0.001;
            const ctx = this.ctx;

            if (!this.isDragging) {
                if (this.autoOrbit && !this.reducedMotion) {
                    this.rotY += this.ecoMode ? 0.0018 : 0.0032;
                }
                this.rotY += this.velY;
                this.rotX = clamp(this.rotX + this.velX, -1.15, 1.15);
                this.velX *= 0.92;
                this.velY *= 0.92;
            }

            this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, 0.1);

            const scaleFactor = clamp(this.width / 620, 0.56, 1);
            const camera = {
                fov: 520 * scaleFactor,
                cameraZ: this.cameraZ,
                centerX: this.width * 0.5,
                centerY: this.width < 480 ? this.height * 0.54 : this.height * 0.5
            };

            ctx.clearRect(0, 0, this.width, this.height);

            // Subtle ambient radial glow in topology center
            const bgGrad = ctx.createRadialGradient(
                camera.centerX,
                camera.centerY,
                10,
                camera.centerX,
                camera.centerY,
                Math.min(this.width, this.height) * 0.52
            );
            bgGrad.addColorStop(0, 'rgba(34, 211, 238, 0.09)');
            bgGrad.addColorStop(1, 'rgba(5, 7, 12, 0)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, this.width, this.height);

            this._drawHexGrid(camera);

            // Compute rotated & projected nodes
            const nodeMap = {};
            const computed = this.topology.nodes.map((node, index) => {
                const floatOffset = Math.sin(timeSec * 1.6 + index * 1.1) * 5;
                const rotated = rotatePoint3D(
                    { x: node.pos.x, y: node.pos.y + floatOffset, z: node.pos.z },
                    this.rotX,
                    this.rotY,
                    0
                );
                const screen = projectPoint3D(rotated, camera);
                const record = { node: node, world: rotated, screen: screen };
                nodeMap[node.id] = record;
                return record;
            }).filter((item) => item.screen !== null);

            // Sort back-to-front by world Z
            computed.sort((a, b) => a.world.z - b.world.z);
            this.projectedNodes = computed;

            // Draw edges
            for (let i = 0; i < this.topology.edges.length; i++) {
                const [fromId, toId] = this.topology.edges[i];
                const from = nodeMap[fromId];
                const to = nodeMap[toId];
                if (!from || !to || !from.screen || !to.screen) continue;

                const isHighlighted =
                    fromId === this.selectedNodeId ||
                    toId === this.selectedNodeId ||
                    fromId === this.hoveredNodeId ||
                    toId === this.hoveredNodeId;

                ctx.strokeStyle = isHighlighted
                    ? 'rgba(34, 211, 238, 0.72)'
                    : 'rgba(148, 163, 184, 0.24)';
                ctx.lineWidth = isHighlighted ? 1.85 : 1.1;

                ctx.beginPath();
                ctx.moveTo(from.screen.x, from.screen.y);
                ctx.lineTo(to.screen.x, to.screen.y);
                ctx.stroke();

                // Ambient idle data pulse along edges
                const pulseT = (timeSec * 0.42 + i * 0.19) % 1;
                const px = lerp(from.screen.x, to.screen.x, pulseT);
                const py = lerp(from.screen.y, to.screen.y, pulseT);
                ctx.fillStyle = isHighlighted ? 'rgba(34, 211, 238, 0.9)' : 'rgba(148, 163, 184, 0.45)';
                ctx.beginPath();
                ctx.arc(px, py, isHighlighted ? 2.4 : 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Advance & render active simulated packets
            for (let i = this.packets.length - 1; i >= 0; i--) {
                const pkt = this.packets[i];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) {
                    this.packets.splice(i, 1);
                    continue;
                }
                const from = nodeMap[pkt.fromId];
                const to = nodeMap[pkt.toId];
                if (!from || !to || !from.screen || !to.screen) continue;

                const x = lerp(from.screen.x, to.screen.x, pkt.progress);
                const y = lerp(from.screen.y, to.screen.y, pkt.progress);

                ctx.fillStyle = pkt.color;
                ctx.shadowColor = pkt.color;
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Draw 3D nodes back-to-front
            for (let i = 0; i < computed.length; i++) {
                const { node, world, screen } = computed[i];
                const isSelected = node.id === this.selectedNodeId;
                const isHovered = node.id === this.hoveredNodeId;
                const isFlowActive = node.id === this.activeFlowNodeId;

                const depthOpacity = clamp((world.z + 240) / 420, 0.45, 1);
                const radius = clamp(21 * screen.scale, 13, 30);

                // 3D wireframe bounding cube around node
                drawNodeWireBox(
                    ctx,
                    world,
                    isSelected ? 29 : 23,
                    this.rotX + timeSec * 0.25,
                    this.rotY + timeSec * 0.35,
                    camera,
                    isSelected || isFlowActive
                        ? 'rgba(34, 211, 238, 0.55)'
                        : 'rgba(148, 163, 184, 0.18)'
                );

                // Outer pulse ring on selected or flow-active node
                if (isSelected || isHovered || isFlowActive) {
                    const ringPulse = radius + 7 + Math.sin(timeSec * 5) * 2.5;
                    ctx.strokeStyle = isFlowActive ? '#10b981' : node.color;
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.arc(screen.x, screen.y, ringPulse, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Core sphere disc
                ctx.save();
                ctx.globalAlpha = depthOpacity;
                const grad = ctx.createRadialGradient(
                    screen.x - radius * 0.3,
                    screen.y - radius * 0.3,
                    2,
                    screen.x,
                    screen.y,
                    radius
                );
                grad.addColorStop(0, '#1e293b');
                grad.addColorStop(1, '#090d16');

                ctx.fillStyle = grad;
                ctx.strokeStyle = isSelected ? '#ffffff' : node.color;
                ctx.lineWidth = isSelected ? 2.2 : 1.5;
                ctx.shadowColor = node.color;
                ctx.shadowBlur = isSelected || isFlowActive ? 18 : 8;
                ctx.beginPath();
                ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Node short code
                ctx.fillStyle = '#f8fafc';
                ctx.font = `700 ${Math.max(9, Math.round(11 * screen.scale))}px "JetBrains Mono", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.short, screen.x, screen.y);

                // Floating label below node
                const labelY = screen.y + radius + 16;
                ctx.font = `600 ${Math.max(10, Math.round(11.5 * screen.scale))}px "Poppins", sans-serif`;
                const textWidth = ctx.measureText(node.label).width;

                ctx.fillStyle = isSelected ? 'rgba(15, 23, 42, 0.92)' : 'rgba(9, 13, 22, 0.78)';
                ctx.strokeStyle = isSelected ? node.color : 'rgba(148, 163, 184, 0.22)';
                ctx.lineWidth = 1;
                const boxX = screen.x - textWidth * 0.5 - 8;
                const boxY = labelY - 10;
                const boxW = textWidth + 16;
                const boxH = 20;

                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(boxX, boxY, boxW, boxH, 6);
                } else {
                    ctx.rect(boxX, boxY, boxW, boxH);
                }
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
                ctx.fillText(node.label, screen.x, labelY);
                ctx.restore();
            }

            this.rafId = requestAnimationFrame(this._tick);
        }
    }

    global.TopologyVisualizer3D = TopologyVisualizer3D;
})(window);
