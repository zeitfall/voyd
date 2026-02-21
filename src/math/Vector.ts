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

	static negate<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.clone().negate() as T;
	}

	static dot<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.dot(vectorB);
	}

	static normalize<T extends Vector>(this: Constructor<T>, vector: T) {
		return vector.clone().normalize() as T;
	}

	static distanceBetween<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.distanceTo(vectorB);
	}
	
	static distanceBetweenSquared<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.distanceToSquared(vectorB);
	}
	
	static angleBetween<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.angleTo(vectorB);
	}
	
	static displacement<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorB.clone().displacementFrom(vectorA) as T;
	} 
	
	static direction<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorB.clone().directionFrom(vectorA) as T;
	}
	
	static projectOnVector<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T) {
		return vectorA.clone().projectOnVector(vectorB) as T;
	}

	static clamp<T extends Vector>(this: Constructor<T>, vector: T, min: T, max: T) {
		return vector.clone().clamp(min, max) as T;
	}

	static lerp<T extends Vector>(this: Constructor<T>, vectorA: T, vectorB: T, factor: number) {
		return vectorA.clone().lerp(vectorB, factor) as T;
	}

	static multiplyByMatrix<T extends Vector>(this: Constructor<T>, vector: T, matrix: Matrix) {
		return vector.clone().multiplyByMatrix(matrix) as T;
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

	multiplyByScalar(scalar: number) {
		return this.scale(scalar);
	}

	divideByScalar(scalar: number) {
		if (Math.abs(scalar) < Number.EPSILON) {
			throw new Error('[Vector]: Division by zero.');
		}

		return this.multiplyByScalar(1 / scalar);
	}

	negate() {
		return this.multiplyByScalar(-1);
	}

	setLength(length: number) {
		if (this.lengthSquared === 0) {
			return this;
		}

		return this.normalize().multiplyByScalar(length);
	}

	normalize() {
		const length = this.length;
	
		if (length === 0) {
			return this;
		}
	
		return this.divideByScalar(length);
	}

	distanceTo(vector: this) {
		return Math.sqrt(this.distanceToSquared(vector));
	}

	angleTo(vector: this) {
		const lengthProduct = this.length * vector.length;

		if (lengthProduct === 0) {
			return 0;
		}
		
		const cosAlpha = this.dot(vector) / lengthProduct;

		return Math.acos(clamp(cosAlpha, -1, 1));
	}

	displacementFrom(vector: this) {
		return this.subtract(vector);
	}

	directionFrom(vector: this) {
		return this.displacementFrom(vector).normalize();
	}

	projectOnVector(vector: this) {
		const vectorLengthSquared = vector.lengthSquared;

		if (vectorLengthSquared > 0) {
			const scalarPart = this.dot(vector) / vectorLengthSquared;

			return this.copy(vector).multiplyByScalar(scalarPart);
		}

		return this.reset();
	}

	notEquals(vector: this, tolerance?: number) {
		return !this.equals(vector, tolerance);
	}

	toString() {
		return this.toArray().toString();
	}

	abstract clone(): Vector;

	abstract copy(vector: this): this;

	abstract set(...components: number[]): this;

	abstract reset(...components: number[]): this;

	abstract add(vector: this): this;

	abstract subtract(vector: this): this;

	abstract scale(...scaleFactors: number[]): this;

	abstract dot(vector: this): number;

	abstract distanceToSquared(vector: this): number;

	abstract clamp(min: this, max: this): this;
	
	abstract lerp(vector: this, factor: number): this;
	
	abstract damp(vector: this, lambda: number, deltaTime: number): this;

	abstract multiplyByMatrix(matrix: Matrix): this;

	abstract equals(vector: this, tolerance?: number): boolean;

	abstract toArray(): number[];
}

export default Vector;
