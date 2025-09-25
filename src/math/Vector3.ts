import Vector from './Vector';

import { clamp, lerp } from '~/utils';

class Vector3 extends Vector {

    static cross(v0: Vector3, v1: Vector3) {
        return v0.cross(v1);
    }

    constructor(x?: number, y?: number, public z = 0) {
        super(x, y);
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    setZ(z: number) {
        this.z = z;

        return this;
    }

    copy(v0: Vector3) {
        return this.set(v0.x, v0.y, v0.z);
    }

    add(v0: Vector3) {
        return this.set(this.x + v0.x, this.y + v0.y, this.z + v0.z);
    }

    subtract(v0: Vector3) {
        return this.set(this.x - v0.x, this.y - v0.y, this.z - v0.z);
    }

    min(v0: Vector3) {
        return this.set(
            Math.min(this.x, v0.x),
            Math.min(this.y, v0.y),
            Math.min(this.z, v0.z),
        );
    }

    max(v0: Vector3) {
        return this.set(
            Math.max(this.x, v0.x),
            Math.max(this.y, v0.y),
            Math.max(this.z, v0.z),
        );
    }

    clamp(v0: Vector3, v1: Vector3) {
        return this.set(
            clamp(this.x, v0.x, v1.x),
            clamp(this.y, v0.y, v1.y),
            clamp(this.z, v0.z, v1.z),
        );
    }

    lerp(v0: Vector3, ratio: number) {
        return this.set(
            lerp(this.x, v0.x, ratio),
            lerp(this.y, v0.y, ratio),
            lerp(this.z, v0.z, ratio),
        );
    }

    scale(sx: number, sy?: number, sz?: number) {
        this.x *= sx;
        this.y *= sy ?? sx;
        this.z *= sz ?? sx;

        return this;
    }

    dot(v0: Vector3) {
        return this.x * v0.x + this.y * v0.y + this.z * v0.z;
    }

    cross(v0: Vector3) {
        const x = this.y * v0.z - this.z * v0.y;
        const y = this.z * v0.x - this.x * v0.z;
        const z = this.x * v0.y - this.y * v0.x;

        return this.set(x, y, z);
    }

    distanceToSquared(v0: Vector3) {
        const dx = this.x - v0.x;
        const dy = this.y - v0.y;
        const dz = this.z - v0.z;

        return dx * dx + dy * dy + dz * dz;
    }

    equals(v0: Vector3, tolerance = 0) {
        return Math.abs(this.x - v0.x) <= tolerance
            && Math.abs(this.y - v0.y) <= tolerance
            && Math.abs(this.z - v0.z) <= tolerance;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

export default Vector3;
