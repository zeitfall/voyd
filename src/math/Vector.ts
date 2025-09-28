import { clamp } from '~/utils';

abstract class Vector {

    static clone(vector: Vector) {
        return vector.clone();
    }

    static copy(vectorA: Vector, vectorB: Vector) {
        return vectorA.copy(vectorB);
    }

    static add(vectorA: Vector, vectorB: Vector) {
        return vectorA.add(vectorB);
    }
    
    static subtract(vectorA: Vector, vectorB: Vector) {
        return vectorA.subtract(vectorB);
    }

    static dot(vectorA: Vector, vectorB: Vector) {
        return vectorA.dot(vectorB);
    }

    static distanceBetweenSquared(vectorA: Vector, vectorB: Vector) {
        return vectorA.distanceToSquared(vectorB);
    }

    static distanceBetween(vectorA: Vector, vectorB: Vector) {
        return vectorA.distanceTo(vectorB);
    }

    static angleBetween(vectorA: Vector, vectorB: Vector) {
        return vectorA.angleBetween(vectorB);
    }

    static equals(vectorA: Vector, vectorB: Vector, tolerance?: number) {
        return vectorA.equals(vectorB, tolerance);
    }

    static notEquals(vectorA: Vector, vectorB: Vector, tolerance?: number) {
        return vectorA.notEquals(vectorB, tolerance);
    }

    static toArray(vector: Vector) {
        return vector.toArray();
    }

    static toString(vector: Vector) {
        return vector.toString();
    }

    get lengthSquared() {
        return this.dot(this);
    }

    get length() {
        return Math.sqrt(this.lengthSquared);
    }

    set length(length: number) {
        this.setLength(length);
    }

    setLength(length: number) {
        return this.normalize().scale(length);
    }

    multiplyByScalar(scalar: number) {
        return this.scale(scalar);
    }

    divideByScalar(scalar: number) {
        return this.scale(1 / (scalar || 1));
    }

    normalize() {
        return this.divideByScalar(this.length);
    }

    distanceTo(vector: Vector) {
        return Math.sqrt(this.distanceToSquared(vector));
    }

    angleBetween(vector: Vector) {
        const dotProduct = this.dot(vector);
        const cosAlpha = dotProduct / (this.length * vector.length);

        return Math.acos(clamp(cosAlpha, -1, 1));
    }

    notEquals(vector: Vector, tolerance?: number) {
        return !this.equals(vector, tolerance);
    }

    toString() {
        return this.toArray().toString();
    }

    abstract clone(): Vector;

    abstract copy(vector: Vector): this;

    abstract set(...components: number[]): this;

    abstract add(vector: Vector): this;

    abstract subtract(vector: Vector): this;

    abstract scale(...scaleFactors: number[]): this;

    abstract dot(vector: Vector): number;

    abstract distanceToSquared(vector: Vector): number;

    abstract equals(vector: Vector, tolerance?: number): boolean;

    abstract toArray(): number[];
}

export default Vector;
