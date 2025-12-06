import type Vector from './Vector';
import type { Constructor } from '~/types';

abstract class Matrix<E extends number[] = number[]> {
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

	#elements: E;

	constructor() {
		this.#elements = [] as unknown as E;

		this.identity();
	}

	get elements() {
		return this.#elements;
	}

	abstract get determinant(): number;

	copy(matrix: Matrix) {
		return this.set(...matrix);
	}

	setFromArray(array: E) {
		return this.set(...array);
	}

	premultiply(matrix: Matrix) {
		return this.multiply(matrix, true);
	}

	divideByScalar(scalar: number) {
		if (scalar === 0) {
			throw new Error('[Matrix]: Division by zero.');
		}

		return this.multiplyByScalar(1 / scalar);
	}

	*[Symbol.iterator]() {
		yield* this.elements;
	}

	abstract clone(): Matrix;

	abstract set(...elements: number[]): this;

	abstract setFromVectors(...vectors: Vector[]): this;

	abstract identity(): this;

	abstract add(matrix: Matrix): this;

	abstract subtract(matrix: Matrix): this;

	abstract multiply(matrix: Matrix, premultiply?: boolean): this;

	abstract multiplyByScalar(scalar: number): this;

	abstract transpose(): this;

	abstract inverse(): this;
}

export default Matrix;
