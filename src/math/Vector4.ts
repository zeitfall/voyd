import Vector from './Vector';

import { clamp, lerp } from '~/utils';

class Vector4 extends Vector {

    constructor(
        x?: number,
        y?: number,
        public z = 0,
        public w = 0
    ) {
        super(x, y);
    }

    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    set(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    setZ(z: number) {
        this.z = z;

        return this;
    }

    setW(w: number) {
        this.w = w;
        
        return this;
    }

    copy(v0: Vector4) {
        return this.set(v0.x, v0.y, v0.z, v0.w);
    }

    add(v0: Vector4) {
        return this.set(this.x + v0.x, this.y + v0.y, this.z + v0.z, this.w + v0.w);
    }

    subtract(v0: Vector4) {
        return this.set(this.x - v0.x, this.y - v0.y, this.z - v0.z, this.w - v0.w);
    }

    min(v0: Vector4) {
        return this.set(
            Math.min(this.x, v0.x),
            Math.min(this.y, v0.y),
            Math.min(this.z, v0.z),
            Math.min(this.w, v0.w),
        );
    }

    max(v0: Vector4) {
        return this.set(
            Math.max(this.x, v0.x),
            Math.max(this.y, v0.y),
            Math.max(this.z, v0.z),
            Math.max(this.w, v0.w),
        );
    }

    clamp(v0: Vector4, v1: Vector4) {
        return this.set(
            clamp(this.x, v0.x, v1.x),
            clamp(this.y, v0.y, v1.y),
            clamp(this.z, v0.z, v1.z),
            clamp(this.w, v0.w, v1.w),
        );
    }

    lerp(v0: Vector4, ratio: number) {
        return this.set(
            lerp(this.x, v0.x, ratio),
            lerp(this.y, v0.y, ratio),
            lerp(this.z, v0.z, ratio),
            lerp(this.w, v0.w, ratio),
        );
    }

    scale(sx: number, sy?: number, sz?: number, sw?: number) {
        this.x *= sx;
        this.y *= sy ?? sx;
        this.z *= sz ?? sx;
        this.w *= sw ?? sx;

        return this;
    }

    dot(v0: Vector4) {
        return this.x * v0.x + this.y * v0.y + this.z * v0.z + this.w * v0.w;
    }

    distanceToSquared(v0: Vector4) {
        const dx = this.x - v0.x;
        const dy = this.y - v0.y;
        const dz = this.z - v0.z;
        const dw = this.w - v0.w;

        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    equals(v0: Vector4, tolerance = 0) {
        return Math.abs(this.x - v0.x) <= tolerance
            && Math.abs(this.y - v0.y) <= tolerance
            && Math.abs(this.z - v0.z) <= tolerance
            && Math.abs(this.w - v0.w) <= tolerance;
    }

    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
}

export default Vector4;
