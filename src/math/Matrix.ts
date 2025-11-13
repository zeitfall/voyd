import { isArray, isArrayOfNumbers, isArrayOfVectors } from '~/assertions';

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

	declare readonly elements: number[];

	constructor(args: unknown[], elementCount: number, columnCount: number) {
		this.elements = this._prepareElements(args, elementCount, columnCount);
	}

	private _prepareElements(args: unknown[], elementCount: number, columnCount: number): number[] {
		if (isArrayOfNumbers(args) && args.length === elementCount) {
			return args.slice();
		}

		if (isArrayOfVectors(args) && args.length === columnCount) {
			return args.flatMap((vector) => vector.toArray());
		}

		if (isArray(args[0]) && args.length === 1) {
			return this._prepareElements(args[0], elementCount, columnCount);
		}

		throw new Error('[Matrix]: Provided arguments are not valid.');
	}

	copy(matrix: Matrix) {
		return this.set(...matrix);
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

	abstract get determinant(): number;

	abstract clone(): Matrix;

	abstract set(...elements: number[]): this;

	abstract add(matrix: Matrix): this;

	abstract subtract(matrix: Matrix): this;

	abstract multiply(matrix: Matrix, premultiply?: boolean): this;

	abstract multiplyByScalar(scalar: number): this;

	abstract transpose(): this;

	abstract inverse(): this;
}

export default Matrix;
