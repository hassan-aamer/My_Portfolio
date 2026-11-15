/**
 * Shared 3D vector rotation, perspective projection, and interpolation utilities.
 * Keeps all 3D canvas and DOM engines DRY without external dependencies.
 */
(function (global) {
    'use strict';

    /**
     * Clamp a numeric value within [min, max].
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Linearly interpolate between start and end by factor t.
     * @param {number} start
     * @param {number} end
     * @param {number} t
     * @returns {number}
     */
    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    /**
     * Rotate a 3D point around X, Y, then Z axes (radians).
     * @param {{x: number, y: number, z: number}} point
     * @param {number} rx
     * @param {number} ry
     * @param {number} [rz=0]
     * @returns {{x: number, y: number, z: number}}
     */
    function rotatePoint3D(point, rx, ry, rz) {
        const angleZ = rz || 0;

        // Rotate around X axis
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const y1 = point.y * cosX - point.z * sinX;
        const z1 = point.y * sinX + point.z * cosX;

        // Rotate around Y axis
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const x2 = point.x * cosY + z1 * sinY;
        const z2 = -point.x * sinY + z1 * cosY;

        if (angleZ === 0) {
            return { x: x2, y: y1, z: z2 };
        }

        // Rotate around Z axis
        const cosZ = Math.cos(angleZ);
        const sinZ = Math.sin(angleZ);
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;

        return { x: x3, y: y3, z: z2 };
    }

    /**
     * Project a 3D coordinate into 2D screen space using perspective division.
     * Returns null when the point sits behind the near clipping plane.
     * @param {{x: number, y: number, z: number}} point
     * @param {{fov: number, cameraZ: number, centerX: number, centerY: number}} camera
     * @returns {{x: number, y: number, z: number, scale: number}|null}
     */
    function projectPoint3D(point, camera) {
        const depth = camera.cameraZ - point.z;
        if (depth <= 12) {
            return null;
        }
        const scale = camera.fov / depth;
        return {
            x: camera.centerX + point.x * scale,
            y: camera.centerY + point.y * scale,
            z: point.z,
            scale: scale
        };
    }

    /**
     * Generate evenly distributed unit sphere coordinates using a Fibonacci lattice.
     * @param {number} count
     * @param {number} radius
     * @returns {Array<{x: number, y: number, z: number}>}
     */
    function buildFibonacciSphere(count, radius) {
        const points = [];
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < count; i++) {
            const yNorm = 1 - (i / Math.max(count - 1, 1)) * 2;
            const radial = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
            const theta = goldenAngle * i;
            points.push({
                x: Math.cos(theta) * radial * radius,
                y: yNorm * radius,
                z: Math.sin(theta) * radial * radius
            });
        }
        return points;
    }

    global.Math3D = Object.freeze({
        clamp: clamp,
        lerp: lerp,
        rotatePoint3D: rotatePoint3D,
        projectPoint3D: projectPoint3D,
        buildFibonacciSphere: buildFibonacciSphere
    });
})(window);
