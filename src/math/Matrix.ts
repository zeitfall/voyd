import type Vector from './Vector';
import type { Constructor } from '~/types';

abstract class Matrix {

	static determinant<T extends Matrix>(this: Constructor<T>, matrix: T) {
		return matrix.determinant;
	}

	static clone<T extends Matrix>(this: Constructor<T>, matrix: T) {
		return matrix.clone() as T;
	}

	static add<T extends Matrix>(this: Constructor<T>, matrixA: T, matrixB: T) {
		return matrixA.clone().add(matrixB) as T;
	}

	static subtract<T extends Matrix>(this: Constructor<T>, matrixA: T, matrixB: T) {
		return matrixA.clone().subtract(matrixB) as T;
	}

	static multiply<T extends Matrix>(this: Constructor<T>, matrixA: T, matrixB: T) {
		return matrixA.clone().multiply(matrixB) as T;
	}

	static premultiply<T extends Matrix>(this: Constructor<T>, matrixA: T, matrixB: T) {
		return matrixA.clone().premultiply(matrixB) as T;
	}

	static transpose<T extends Matrix>(this: Constructor<T>, matrix: T) {
		return matrix.clone().transpose() as T;
	}

	static inverse<T extends Matrix>(this: Constructor<T>, matrix: T) {
		return matrix.clone().inverse() as T;
	}

	#array: Float32Array<ArrayBuffer>;

	constructor(length: number) {
		this.#array = new Float32Array(length);

		this.identity();
	}

	get array() {
		return this.#array;
	}

	abstract get determinant(): number;

	copy(matrix: Matrix) {
		this.array.set(matrix.array);

		return this;
	}

	premultiply(matrix: Matrix) {
		return this.multiply(matrix, true);
	}

	divideByScalar(scalar: number) {
		if (Math.abs(scalar) < Number.EPSILON) {
			throw new Error('[Matrix]: Division by zero.');
		}

		return this.multiplyByScalar(1 / scalar);
	}

	*[Symbol.iterator]() {
		yield* this.array;
	}

	abstract clone(): Matrix;

	abstract set(...elements: number[]): this;

	abstract identity(): this;

	abstract setFromVectors(...vectors: Vector[]): this;

	abstract add(matrix: Matrix): this;

	abstract subtract(matrix: Matrix): this;

	abstract multiply(matrix: Matrix, premultiply?: boolean): this;

	abstract multiplyByScalar(scalar: number): this;

	abstract transpose(): this;

	abstract inverse(): this;
}

export default Matrix;
