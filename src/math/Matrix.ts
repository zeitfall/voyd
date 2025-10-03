import { isArray, isArrayOfNumbers, isArrayOfVectors } from '~/assertions';

abstract class Matrix {
	readonly elements: number[];

	constructor(args: unknown[], elementCount: number, columnCount: number) {
		this.elements = this._prepareElements(args, elementCount, columnCount);
	}

	protected _prepareElements(args: unknown[], elementCount: number, columnCount: number): number[] {
		if (isArrayOfNumbers(args) && args.length === elementCount) {
			return args;
		}

		if (isArrayOfVectors(args) && args.length === columnCount) {
			return args.flatMap((vector) => vector.toArray());
		}

		if (isArray(args[0]) && args.length === 1) {
			return this._prepareElements(args[0], elementCount, columnCount);
		}

		throw new Error('[Matrix4]: Provided arguments are not valid.');
	}

	*[Symbol.iterator]() {
		yield* this.elements;
	}
}

export default Matrix;
