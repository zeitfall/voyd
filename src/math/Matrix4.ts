import Matrix from './Matrix';

import type { ArrayOf } from '~/types';
import type Vector4 from './Vector4';

const ELEMENT_COUNT = 16;
const COLUMN_COUNT = 4;

type Matrix4Elements = ArrayOf<number, typeof ELEMENT_COUNT>;
type Matrix4Columns = ArrayOf<Vector4, typeof COLUMN_COUNT>;

class Matrix4 extends Matrix {
	static identity() {
		return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}

	declare readonly elements: Matrix4Elements;

	constructor(elements: Matrix4Elements);
	constructor(columns: Matrix4Columns);
	constructor(...element: Matrix4Elements);
	constructor(...column: Matrix4Columns);
	constructor(...args: unknown[]) {
		super(args, ELEMENT_COUNT, COLUMN_COUNT);
	}

	get determinant() {
		const a = this.elements;

		const e11 = a[0];
		const e12 = a[4];
		const e13 = a[8];
		const e14 = a[12];
		const e21 = a[1];
		const e22 = a[5];
		const e23 = a[9];
		const e24 = a[13];
		const e31 = a[2];
		const e32 = a[6];
		const e33 = a[10];
		const e34 = a[14];
		const e41 = a[3];
		const e42 = a[7];
		const e43 = a[11];
		const e44 = a[15];

		return (
			e11 * (e22 * (e33 * e44 - e34 * e43) - e23 * (e32 * e44 - e34 * e42) + e24 * (e32 * e43 - e33 * e42)) -
			e12 * (e21 * (e33 * e44 - e34 * e43) - e23 * (e31 * e44 - e34 * e41) + e24 * (e31 * e43 - e33 * e41)) +
			e13 * (e21 * (e32 * e44 - e34 * e42) - e22 * (e31 * e44 - e34 * e41) + e24 * (e31 * e42 - e32 * e41)) -
			e14 * (e21 * (e32 * e43 - e33 * e42) - e22 * (e31 * e43 - e33 * e41) + e23 * (e31 * e42 - e32 * e41))
		);
	}

	clone() {
		return new Matrix4(this.elements);
	}

	set(...elements: Matrix4Elements) {
		const a = this.elements;
		const b = elements;

		a[0] = b[0];
		a[1] = b[1];
		a[2] = b[2];
		a[3] = b[3];
		a[4] = b[4];
		a[5] = b[5];
		a[6] = b[6];
		a[7] = b[7];
		a[8] = b[8];
		a[9] = b[9];
		a[10] = b[10];
		a[11] = b[11];
		a[12] = b[12];
		a[13] = b[13];
		a[14] = b[14];
		a[15] = b[15];

		return this;
	}

	add(matrix: Matrix4) {
		const a = this.elements;
		const b = matrix.elements;

		return this.set(
			a[0] + b[0],
			a[1] + b[1],
			a[2] + b[2],
			a[3] + b[3],
			a[4] + b[4],
			a[5] + b[5],
			a[6] + b[6],
			a[7] + b[7],
			a[8] + b[8],
			a[9] + b[9],
			a[10] + b[10],
			a[11] + b[11],
			a[12] + b[12],
			a[13] + b[13],
			a[14] + b[14],
			a[15] + b[15],
		);
	}

	subtract(matrix: Matrix4) {
		const a = this.elements;
		const b = matrix.elements;

		return this.set(
			a[0] - b[0],
			a[1] - b[1],
			a[2] - b[2],
			a[3] - b[3],
			a[4] - b[4],
			a[5] - b[5],
			a[6] - b[6],
			a[7] - b[7],
			a[8] - b[8],
			a[9] - b[9],
			a[10] - b[10],
			a[11] - b[11],
			a[12] - b[12],
			a[13] - b[13],
			a[14] - b[14],
			a[15] - b[15],
		);
	}

	multiply(matrix: Matrix4, premultiply = false) {
		const a = premultiply ? matrix.elements : this.elements;
		const b = premultiply ? this.elements : matrix.elements;

		const a11 = a[0];
		const a12 = a[4];
		const a13 = a[8];
		const a14 = a[12];
		const a21 = a[1];
		const a22 = a[5];
		const a23 = a[9];
		const a24 = a[13];
		const a31 = a[2];
		const a32 = a[6];
		const a33 = a[10];
		const a34 = a[14];
		const a41 = a[3];
		const a42 = a[7];
		const a43 = a[11];
		const a44 = a[15];

		const b11 = b[0];
		const b12 = b[4];
		const b13 = b[8];
		const b14 = b[12];
		const b21 = b[1];
		const b22 = b[5];
		const b23 = b[9];
		const b24 = b[13];
		const b31 = b[2];
		const b32 = b[6];
		const b33 = b[10];
		const b34 = b[14];
		const b41 = b[3];
		const b42 = b[7];
		const b43 = b[11];
		const b44 = b[15];

		return this.set(
			a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
			a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
			a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41,
			a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,

			a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
			a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
			a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42,
			a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,

			a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
			a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
			a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43,
			a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,

			a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,
			a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,
			a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44,
			a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44,
		);
	}

	multiplyByScalar(scalar: number) {
		const a = this.elements;

		return this.set(
			scalar * a[0],
			scalar * a[1],
			scalar * a[2],
			scalar * a[3],
			scalar * a[4],
			scalar * a[5],
			scalar * a[6],
			scalar * a[7],
			scalar * a[8],
			scalar * a[9],
			scalar * a[10],
			scalar * a[11],
			scalar * a[12],
			scalar * a[13],
			scalar * a[14],
			scalar * a[15],
		);
	}

	transpose() {
		const a = this.elements;

		const e11 = a[0];
		const e12 = a[4];
		const e13 = a[8];
		const e14 = a[12];
		const e21 = a[1];
		const e22 = a[5];
		const e23 = a[9];
		const e24 = a[13];
		const e31 = a[2];
		const e32 = a[6];
		const e33 = a[10];
		const e34 = a[14];
		const e41 = a[3];
		const e42 = a[7];
		const e43 = a[11];
		const e44 = a[15];

		return this.set(e11, e12, e13, e14, e21, e22, e23, e24, e31, e32, e33, e34, e41, e42, e43, e44);
	}
}

export default Matrix4;
