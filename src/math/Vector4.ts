import Vector from './Vector';

class Vector4 extends Vector {

    constructor(public x = 0, public y = 0, public z = 0, public w = 0) {
        super();
    }

    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    copy(vector: Vector4) {
        return this.set(vector.x, vector.y, vector.z, vector.w);
    }

    set(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        
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

    setZ(z: number) {
        this.z = z;

        return this;
    }

    setW(w: number) {
        this.w = w;

        return this;
    }

    add(vector: Vector4) {
        return this.set(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z,
            this.w + vector.w
        );
    }

    subtract(vector: Vector4) {
        return this.set(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z,
            this.w - vector.w
        );
    }

    scale(scaleX: number, scaleY?: number, scaleZ?: number, scaleW?: number) {
        const sx = scaleX;
        const sy = scaleY ?? scaleX;
        const sz = scaleZ ?? scaleY ?? scaleX;
        const sw = scaleW ?? scaleZ ?? scaleY ?? scaleX;

        return this.set(sx * this.x, sy * this.y, sz * this.z, sw * this.w);
    }

    dot(vector: Vector4) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    distanceToSquared(vector: Vector4) {
        const dx = vector.x - this.x;
        const dy = vector.y - this.y;
        const dz = vector.z - this.z;
        const dw = vector.w - this.w;

        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    equals(vector: Vector4, tolerance = 0) {
        return Math.abs(vector.x - this.x) <= tolerance
            && Math.abs(vector.y - this.y) <= tolerance
            && Math.abs(vector.z - this.z) <= tolerance
            && Math.abs(vector.w - this.w) <= tolerance;
    }

    toArray() { 
        return [this.x, this.y, this.z, this.w];
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}

export default Vector4;
