import Vector from './Vector';

class Vector2 extends Vector {

    constructor(public x = 0, public y = 0) {
        super();
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    copy(vector: Vector2) {
        return this.set(vector.x, vector.y);
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

    add(vector: Vector2) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    subtract(vector: Vector2) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    scale(scaleX: number, scaleY?: number) {
        this.x *= scaleX;
        this.y *= scaleY ?? scaleX;

        return this;
    }

    dot(vector: Vector2) {
        return this.x * vector.x + this.y * vector.y;
    }

    distanceToSquared(vector: Vector2) {
        const dx = vector.x - this.x;
        const dy = vector.y - this.y;

        return dx * dx + dy * dy;
    }

    equals(vector: Vector2, tolerance = 0) {
        return Math.abs(vector.x - this.x) <= tolerance
            && Math.abs(vector.y - this.y) <= tolerance;
    }

    toArray() {
        return [this.x, this.y];
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}

export default Vector2;
