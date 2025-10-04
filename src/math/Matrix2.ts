import Matrix from './Matrix';

import type { ArrayOf } from '~/types';
import type Vector2 from './Vector2';

const ELEMENT_COUNT = 4;
const COLUMN_COUNT = 2;

type Matrix2Elements = ArrayOf<number, typeof ELEMENT_COUNT>;
type Matrix2Columns = ArrayOf<Vector2, typeof COLUMN_COUNT>;

class Matrix2 extends Matrix {
	static identity() {
		return new Matrix2(1, 0, 0, 1);
	}

	declare readonly elements: Matrix2Elements;

	constructor(elements: Matrix2Elements);
	constructor(columns: Matrix2Columns);
	constructor(...element: Matrix2Elements);
	constructor(...column: Matrix2Columns);
	constructor(...args: unknown[]) {
		super(args, ELEMENT_COUNT, COLUMN_COUNT);
	}

	get determinant() {
		const a11 = this.elements[0];
		const a12 = this.elements[2];
		const a21 = this.elements[1];
		const a22 = this.elements[3];

		return a11 * a22 - a12 * a21;
	}

	clone() {
		return new Matrix2(this.elements);
	}

	set(...elements: Matrix2Elements) {
		this.elements[0] = elements[0];
		this.elements[1] = elements[1];
		this.elements[2] = elements[2];
		this.elements[3] = elements[3];

		return this;
	}

	add(matrix: Matrix2) {
		return this.set(
			this.elements[0] + matrix.elements[0],
			this.elements[1] + matrix.elements[1],
			this.elements[2] + matrix.elements[2],
			this.elements[3] + matrix.elements[3],
		);
	}

	subtract(matrix: Matrix2) {
		return this.set(
			this.elements[0] - matrix.elements[0],
			this.elements[1] - matrix.elements[1],
			this.elements[2] - matrix.elements[2],
			this.elements[3] - matrix.elements[3],
		);
	}

	multiply(matrix: Matrix2, premultiply = false) {
		const a = premultiply ? matrix : this;
		const b = premultiply ? this : matrix;

		const a11 = a.elements[0];
		const a12 = a.elements[2];
		const a21 = a.elements[1];
		const a22 = a.elements[3];

		const b11 = b.elements[0];
		const b12 = b.elements[2];
		const b21 = b.elements[1];
		const b22 = b.elements[3];

		// prettier-ignore
		return this.set(
			a11 * b11 + a12 * b21, a21 * b11 + a22 * b21,
			a11 * b12 + a12 * b22, a21 * b12 + a22 * b22,
		);
	}

	multiplyByScalar(scalar: number) {
		return this.set(
			scalar * this.elements[0],
			scalar * this.elements[1],
			scalar * this.elements[2],
			scalar * this.elements[3],
		);
	}

	transpose() {
		const e11 = this.elements[0];
		const e12 = this.elements[2];
		const e21 = this.elements[1];
		const e22 = this.elements[3];

		return this.set(e11, e12, e21, e22);
	}
}

export default Matrix2;
