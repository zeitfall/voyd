import { clamp } from '~/utils';

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

    static distanceBetweenSquared(v0: Vector, v1: Vector) {
        return v0.distanceToSquared(v1);
    }

    static distanceBetween(v0: Vector, v1: Vector) {
        return v0.distanceTo(v1);
    }

    static angleBetween(v0: Vector, v1: Vector) {
        return v0.angleBetween(v1);
    }

    static equals(v0: Vector, v1: Vector) {
        return v0.equals(v1);
    }

    static notEquals(v0: Vector, v1: Vector) {
        return v0.notEquals(v1);
    }

    static toArray(v0: Vector) {
        return v0.toArray();
    }

    static toString(v0: Vector) {
        return v0.toString();
    }

    constructor(public x = 0, public y = 0) {}

    get lengthSquared() {
        return this.dot(this);
    }

    get length() {
        return Math.sqrt(this.lengthSquared);
    }

    set length(length: number) {
        this.normalize().scale(length);
    }

    setX(x: number) {
        this.x = x;

        return this;
    }

    setY(y: number) {
        this.y = y;

        return this;
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

    distanceTo(v0: Vector) {
        return Math.sqrt(this.distanceToSquared(v0));
    }

    angleBetween(v0: Vector) {
        const cosAlpha = this.dot(v0) / (this.length * v0.length);

        return Math.acos(clamp(cosAlpha, -1, 1));
    }

    notEquals(v0: Vector, tolerance = 0) {
        return !this.equals(v0, tolerance);
    }

    toString() {
        return this.toArray().toString();
    }

    abstract clone(): Vector;

    abstract set(...components: number[]): this;

    abstract copy(v0: Vector): this;

    abstract add(v0: Vector): this;

    abstract subtract(v0: Vector): this;

    abstract min(v0: Vector): this;

    abstract max(v0: Vector): this;

    abstract clamp(v0: Vector, v1: Vector): this;

    abstract lerp(v0: Vector, value: number): this;

    abstract scale(...components: number[]): this;

    abstract dot(v0: Vector): number;

    abstract distanceToSquared(v0: Vector): number;

    abstract equals(v0: Vector, tolerance?: number): boolean;

    abstract toArray(): number[];
}

export default Vector;
