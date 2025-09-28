import Vector from './Vector';

class Vector3 extends Vector {

    static cross(vectorA: Vector3, vectorB: Vector3) {
        return vectorA.cross(vectorB);
    }

    constructor(public x = 0, public y = 0, public z = 0) {
        super();
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    copy(vector: Vector3) {
        return this.set(vector.x, vector.y, vector.z);
    }

    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        
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

    add(vector: Vector3) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    subtract(vector: Vector3) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;

        return this;
    }

    cross(vector: Vector3) {
        return this.set(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    scale(scaleX: number, scaleY?: number, scaleZ?: number) {
        this.x *= scaleX;
        this.y *= scaleY ?? scaleX;
        this.z *= scaleZ ?? scaleY ?? scaleX;

        return this;
    }

    dot(vector: Vector3) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    distanceToSquared(vector: Vector3) {
        const dx = vector.x - this.x;
        const dy = vector.y - this.y;
        const dz = vector.z - this.z;

        return dx * dx + dy * dy + dz * dz;
    }

    equals(vector: Vector3, tolerance = 0) {
        return Math.abs(vector.x - this.x) <= tolerance
            && Math.abs(vector.y - this.y) <= tolerance
            && Math.abs(vector.z - this.z) <= tolerance;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

export default Vector3;
