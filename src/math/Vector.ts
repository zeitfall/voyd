import { clamp } from '~/utils';

import type Matrix from './Matrix';
import type { Constructor } from '~/types';

abstract class Vector {
	static clone<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.clone() as T;
	}

	static add<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.clone().add(vectorB) as T;
	}

	static subtract<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.clone().subtract(vectorB) as T;
	}

	static displacement<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorB.clone().displacementFrom(vectorA) as T;
	} 

	static direction<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorB.clone().directionFrom(vectorA) as T;
	}

	static clamp<T extends Vector>(this: Constructor<T>, vector: T, min: T, max: T) {
		return vector.clone().clamp(min, max) as T;
	}

	static lerp<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T, fraction: number) {
		return vectorA.clone().lerp(vectorB, fraction) as T;
	}

	static multiplyByMatrix<T extends Vector>(this: Constructor<T>, vector: T, matrix: Matrix) {
		return vector.clone().multiplyByMatrix(matrix) as T;
	}

	static projectOnVector<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.clone().projectOnVector(vectorB) as T;
	}

	static normalize<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.clone().normalize() as T;
	}

	static negate<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.clone().negate() as T;
	}

	static dot<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.dot(vectorB);
	}

	static distanceBetweenSquared<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.distanceToSquared(vectorB);
	}

	static distanceBetween<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.distanceTo(vectorB);
	}

	static angleBetween<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.angleTo(vectorB);
	}

	static equals<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T, tolerance?: number) {
		return vectorA.equals(vectorB, tolerance);
	}

	static notEquals<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T, tolerance?: number) {
		return vectorA.notEquals(vectorB, tolerance);
	}

	static toArray<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.toArray();
	}

	static toString<T extends Vector>(this: Constructor<T>, vector: T) {
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

	projectOnVector(vector: Vector) {
		const vLSq = vector.lengthSquared;

		if (vLSq > 0) {
			const scalarPart = this.dot(vector) / vLSq;

			return this.copy(vector).multiplyByScalar(scalarPart);
		}

		return this.reset();
	}

	displacementFrom(vector: Vector) {
		return this.subtract(vector);
	}

	directionFrom(vector: Vector) {
		return this.displacementFrom(vector).normalize();
	}

	multiplyByScalar(scalar: number) {
		return this.scale(scalar);
	}

	divideByScalar(scalar: number) {
		if (Math.abs(scalar) < Number.EPSILON) {
			throw new Error('[Vector]: Division by zero.');
		}

		return this.multiplyByScalar(1 / scalar);
	}

	normalize() {
		return this.divideByScalar(this.length);
	}

	negate() {
		return this.multiplyByScalar(-1);
	}

	distanceTo(vector: Vector) {
		return Math.sqrt(this.distanceToSquared(vector));
	}

	angleTo(vector: Vector) {
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

	abstract reset(...components: number[]): this;

	abstract add(vector: Vector): this;

	abstract subtract(vector: Vector): this;

	abstract clamp(min: Vector, max: Vector): this;

	abstract lerp(vector: Vector, fraction: number): this;

	abstract multiplyByMatrix(matrix: Matrix): this;

	abstract scale(...scaleFactors: number[]): this;

	abstract dot(vector: Vector): number;

	abstract distanceToSquared(vector: Vector): number;

	abstract equals(vector: Vector, tolerance?: number): boolean;

	abstract toArray(): number[];
}

export default Vector;
