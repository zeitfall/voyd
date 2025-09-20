abstract class Vector {

    static {}

    static clone(v0: Vector) {
        return v0.clone();
    }

    static negate(v0: Vector) {
        return v0.negate();
    }

    static normalize(v0: Vector) {
        return v0.normalize();
    }

    static dot(v0: Vector, v1: Vector) {
        return v0.dot(v1);
    }

    static cross(v0: Vector, v1: Vector) {
        return v0.cross(v1);
    }

    static distanceBetweenSquared(v0: Vector, v1: Vector) {
        return v0.distanceToSquared(v1);
    }

    static distanceBetween(v0: Vector, v1: Vector) {
        return v0.distanceTo(v1);
    }

    static angleBetween(v0: Vector, v1: Vector) {
        return v0.angleBetween(v1);
    }

    static toArray(v0: Vector) {
        return v0.toArray();
    }

    static toString(v0: Vector) {
        return v0.toString();
    }

    get lengthSquared() {
        return this.dot(this);
    }

    get length() {
        return Math.sqrt(this.lengthSquared);
    }

    set length(length: number) {
        this.normalize().scale(length);
    }

    setLength(length: number) {
        this.length = length;
    }

    multiplyByScalar(scalar: number) {
        return this.scale(scalar);
    }

    divideByScalar(scalar: number) {
        return this.multiplyByScalar(1 / (scalar || 1));
    }

    negate() {
        return this.multiplyByScalar(-1);
    }

    normalize() {
        return this.divideByScalar(this.length);
    }

    toString() {
        return this.toArray().toString();
    }

    abstract clone(): Vector;

    abstract set(x: number, y: number): this;

    abstract setX(x: number): this;

    abstract setY(y: number): this;

    abstract copy(v0: Vector): this;

    abstract add(v0: Vector): this;

    abstract subtract(v0: Vector): this;

    abstract min(v0: Vector): this;

    abstract max(v0: Vector): this;

    abstract clamp(v0: Vector, v1: Vector): this;

    abstract lerp(v0: Vector, value: number): this;

    abstract scale(sx: number, sy?: number): this;

    abstract dot(v0: Vector): number;

    abstract cross(v0: Vector): number;

    abstract distanceToSquared(v0: Vector): number;

    abstract distanceTo(v0: Vector): number;

    abstract angleBetween(v0: Vector): number;

    abstract equals(v0: Vector, tolerance?: number): boolean;

    abstract toArray(): number[];
}

export default Vector;
