import Vector from './Vector';

import { clamp, lerp } from '~/utils';

class Vector2 extends Vector {

    constructor(public x: number, public y: number) {
        super();
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;

        return this;
    }

    setX(x: number) {
        this.x = x;

        return this;
    }

    setY(y: number) {
        this.y = y;

        return this;
    }

    copy(v0: Vector2) {
        return this.set(v0.x, v0.y);
    }

    add(v0: Vector2) {
        return this.set(this.x + v0.x, this.y + v0.y);
    }

    subtract(v0: Vector2) {
        return this.set(this.x - v0.x, this.y - v0.y);
    }

    min(v0: Vector2) {
        return this.set(
            Math.min(this.x, v0.x),
            Math.min(this.y, v0.y),
        );
    }

    max(v0: Vector2) {
        return this.set(
            Math.max(this.x, v0.x),
            Math.max(this.y, v0.y),
        );
    }

    clamp(v0: Vector2, v1: Vector2) {
        return this.set(
            clamp(this.x, v0.x, v1.x),
            clamp(this.y, v0.y, v1.y),
        );
    }

    lerp(v0: Vector2, value: number) {
        return this.set(
            lerp(this.x, v0.x, value),
            lerp(this.y, v0.y, value),
        );
    }

    scale(sx: number, sy?: number) {
        this.x *= sx;
        this.y *= sy ?? sx;

        return this;
    }

    dot(v0: Vector2) {
        return this.x * v0.x + this.y * v0.y;
    }

    cross(v0: Vector2) {
        return this.x * v0.y - this.y * v0.x;
    }

    distanceToSquared(v0: Vector2) {
        const dx = this.x - v0.x;
        const dy = this.y - v0.y;

        return dx * dx + dy * dy;
    }

    distanceTo(v0: Vector2) {
        return Math.sqrt(this.distanceToSquared(v0));
    }

    angleBetween(v0: Vector2) {
        const cosAlpha = this.dot(v0) / (this.length * v0.length);

        return Math.acos(clamp(cosAlpha, -1, 1));
    }

    equals(v0: Vector2, tolerance = 0) {
        return Math.abs(this.x - v0.x) <= tolerance && Math.abs(this.y - v0.y) <= tolerance;
    }

    notEquals(v0: Vector2, tolerance = 0) {
        return !this.equals(v0, tolerance);
    }

    toArray() {
        return [this.x, this.y];
    }
}

export default Vector2;
