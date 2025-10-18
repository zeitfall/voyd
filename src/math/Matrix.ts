import { isArray, isArrayOfNumbers, isArrayOfVectors } from '~/assertions';

abstract class Matrix {
	static determinant(matrix: Matrix) {
		return matrix.determinant;
	}

	static clone(matrix: Matrix) {
		return matrix.clone();
	}

	static add(matrixA: Matrix, matrixB: Matrix) {
		return matrixA.clone().add(matrixB);
	}

	static subtract(matrixA: Matrix, matrixB: Matrix) {
		return matrixA.clone().subtract(matrixB);
	}

	static multiply(matrixA: Matrix, matrixB: Matrix) {
		return matrixA.clone().multiply(matrixB);
	}

	static premultiply(matrixA: Matrix, matrixB: Matrix) {
		return matrixA.clone().premultiply(matrixB);
	}

	static transpose(matrix: Matrix) {
		return matrix.clone().transpose();
	}

	static inverse(matrix: Matrix) {
		return matrix.clone().inverse();
	}

	declare readonly elements: number[];

	constructor(args: unknown[], elementCount: number, columnCount: number) {
		this.elements = this.#prepareElements(args, elementCount, columnCount);
	}

	#prepareElements(args: unknown[], elementCount: number, columnCount: number): number[] {
		if (isArrayOfNumbers(args) && args.length === elementCount) {
			return args.slice();
		}

		if (isArrayOfVectors(args) && args.length === columnCount) {
			return args.flatMap((vector) => vector.toArray());
		}

		if (isArray(args[0]) && args.length === 1) {
			return this.#prepareElements(args[0], elementCount, columnCount);
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
