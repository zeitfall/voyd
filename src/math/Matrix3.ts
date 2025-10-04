import Matrix from './Matrix';

import type { ArrayOf } from '~/types';
import type Vector3 from './Vector3';

const ELEMENT_COUNT = 9;
const COLUMN_COUNT = 3;

type Matrix3Elements = ArrayOf<number, typeof ELEMENT_COUNT>;
type Matrix3Columns = ArrayOf<Vector3, typeof COLUMN_COUNT>;

class Matrix3 extends Matrix {
	static identity() {
		return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
	}

	declare readonly elements: Matrix3Elements;

	constructor(elements: Matrix3Elements);
	constructor(columns: Matrix3Columns);
	constructor(...element: Matrix3Elements);
	constructor(...column: Matrix3Columns);
	constructor(...args: unknown[]) {
		super(args, ELEMENT_COUNT, COLUMN_COUNT);
	}

	get determinant() {
		const e11 = this.elements[0];
		const e12 = this.elements[3];
		const e13 = this.elements[6];
		const e21 = this.elements[1];
		const e22 = this.elements[4];
		const e23 = this.elements[7];
		const e31 = this.elements[2];
		const e32 = this.elements[5];
		const e33 = this.elements[8];

		return e11 * (e22 * e33 - e23 * e32) + e12 * (e23 * e31 - e21 * e33) + e13 * (e21 * e32 - e22 * e31);
	}

	clone() {
		return new Matrix3(this.elements);
	}

	set(...elements: Matrix3Elements) {
		this.elements[0] = elements[0];
		this.elements[1] = elements[1];
		this.elements[2] = elements[2];
		this.elements[3] = elements[3];
		this.elements[4] = elements[4];
		this.elements[5] = elements[5];
		this.elements[6] = elements[6];
		this.elements[7] = elements[7];
		this.elements[8] = elements[8];

		return this;
	}

	add(matrix: Matrix3) {
		return this.set(
			this.elements[0] + matrix.elements[0],
			this.elements[1] + matrix.elements[1],
			this.elements[2] + matrix.elements[2],
			this.elements[3] + matrix.elements[3],
			this.elements[4] + matrix.elements[4],
			this.elements[5] + matrix.elements[5],
			this.elements[6] + matrix.elements[6],
			this.elements[7] + matrix.elements[7],
			this.elements[8] + matrix.elements[8],
		);
	}

	subtract(matrix: Matrix3) {
		return this.set(
			this.elements[0] - matrix.elements[0],
			this.elements[1] - matrix.elements[1],
			this.elements[2] - matrix.elements[2],
			this.elements[3] - matrix.elements[3],
			this.elements[4] - matrix.elements[4],
			this.elements[5] - matrix.elements[5],
			this.elements[6] - matrix.elements[6],
			this.elements[7] - matrix.elements[7],
			this.elements[8] - matrix.elements[8],
		);
	}

	multiply(matrix: Matrix3, premultiply = false) {
		const a = premultiply ? matrix : this;
		const b = premultiply ? this : matrix;

		const a11 = a.elements[0];
		const a12 = a.elements[3];
		const a13 = a.elements[6];
		const a21 = a.elements[1];
		const a22 = a.elements[4];
		const a23 = a.elements[7];
		const a31 = a.elements[2];
		const a32 = a.elements[5];
		const a33 = a.elements[8];

		const b11 = b.elements[0];
		const b12 = b.elements[3];
		const b13 = b.elements[6];
		const b21 = b.elements[1];
		const b22 = b.elements[4];
		const b23 = b.elements[7];
		const b31 = b.elements[2];
		const b32 = b.elements[5];
		const b33 = b.elements[8];

		// prettier-ignore
		return this.set(
			a11 * b11 + a12 * b21 + a13 * b31, a21 * b11 + a22 * b21 + a23 * b31, a31 * b11 + a32 * b21 + a33 * b31,
			a11 * b12 + a12 * b22 + a13 * b32, a21 * b12 + a22 * b22 + a23 * b32, a31 * b12 + a32 * b22 + a33 * b32,
			a11 * b13 + a12 * b23 + a13 * b33, a21 * b13 + a22 * b23 + a23 * b33, a31 * b13 + a32 * b23 + a33 * b33
		);
	}

	multiplyByScalar(scalar: number) {
		return this.set(
			scalar * this.elements[0],
			scalar * this.elements[1],
			scalar * this.elements[2],
			scalar * this.elements[3],
			scalar * this.elements[4],
			scalar * this.elements[5],
			scalar * this.elements[6],
			scalar * this.elements[7],
			scalar * this.elements[8],
		);
	}

	transpose() {
		const e11 = this.elements[0];
		const e12 = this.elements[3];
		const e13 = this.elements[6];
		const e21 = this.elements[1];
		const e22 = this.elements[4];
		const e23 = this.elements[7];
		const e31 = this.elements[2];
		const e32 = this.elements[5];
		const e33 = this.elements[8];

		return this.set(e11, e12, e13, e21, e22, e23, e31, e32, e33);
	}
}

export default Matrix3;
