import Matrix from './Matrix';

import type Vector3 from './Vector3';
import type Quaternion from './Quaternion';
import type { ArrayOf } from '~/types';

type Matrix3Elements = ArrayOf<number, 9>;

class Matrix3 extends Matrix<Matrix3Elements> {
	static fromArray(array: Matrix3Elements) {
		return new Matrix3().setFromArray(array);
	}

	static fromVectors(vectorA: Vector3, vectorB: Vector3, vectorC: Vector3) {
		return new Matrix3().setFromVectors(vectorA, vectorB, vectorC);
	}

	static fromQuaternion(quaternion: Quaternion) {
		return new Matrix3().setFromQuaternion(quaternion);
	}

	constructor() {
		super();
	}

	get determinant() {
		const a = this.elements;

		const e11 = a[0];
		const e12 = a[3];
		const e13 = a[6];
		const e21 = a[1];
		const e22 = a[4];
		const e23 = a[7];
		const e31 = a[2];
		const e32 = a[5];
		const e33 = a[8];

		return e11 * (e22 * e33 - e23 * e32) + e12 * (e23 * e31 - e21 * e33) + e13 * (e21 * e32 - e22 * e31);
	}

	clone() {
		return new Matrix3().set(...this.elements)
	}

	set(...elements: Matrix3Elements) {
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

		return this;
	}

	setFromVectors(vectorA: Vector3, vectorB: Vector3, vectorC: Vector3) {
		return this.set(
			vectorA.x, vectorA.y, vectorA.z,
			vectorB.x, vectorB.y, vectorB.z,
			vectorC.x, vectorC.y, vectorC.z
		);
	}

	setFromQuaternion(quaternion: Quaternion) {
		const x = quaternion.x;
		const y = quaternion.y;
		const z = quaternion.z;
		const w = quaternion.w;

		const x2 = x * x;
		const y2 = y * y;
		const z2 = z * z;

		const xy = x * y;
		const xz = x * z;
		const xw = x * w;
		const yz = y * z;
		const yw = y * w;
		const zw = z * w;

		return this.set(
			1 - 2 * (y2 + z2), 2 * (xy + zw), 2 * (xz - yw),
			2 * (xy - zw), 1 - 2 * (x2 + z2), 2 * (xw + yz),
			2 * (yw + xz), 2 * (yz - xw), 1 - 2 * (x2 + y2)
		);
	}

	identity() {
		return this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
	}

	add(matrix: Matrix3) {
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
		);
	}

	subtract(matrix: Matrix3) {
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
		);
	}

	multiply(matrix: Matrix3, premultiply = false) {
		const a = premultiply ? matrix.elements : this.elements;
		const b = premultiply ? this.elements : matrix.elements;

		const a11 = a[0];
		const a12 = a[3];
		const a13 = a[6];
		const a21 = a[1];
		const a22 = a[4];
		const a23 = a[7];
		const a31 = a[2];
		const a32 = a[5];
		const a33 = a[8];

		const b11 = b[0];
		const b12 = b[3];
		const b13 = b[6];
		const b21 = b[1];
		const b22 = b[4];
		const b23 = b[7];
		const b31 = b[2];
		const b32 = b[5];
		const b33 = b[8];

		// biome-ignore format: It's easier to distinguish matrix columns.
		return this.set(
			a11 * b11 + a12 * b21 + a13 * b31, a21 * b11 + a22 * b21 + a23 * b31, a31 * b11 + a32 * b21 + a33 * b31,
			a11 * b12 + a12 * b22 + a13 * b32, a21 * b12 + a22 * b22 + a23 * b32, a31 * b12 + a32 * b22 + a33 * b32,
			a11 * b13 + a12 * b23 + a13 * b33, a21 * b13 + a22 * b23 + a23 * b33, a31 * b13 + a32 * b23 + a33 * b33
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
		);
	}

	transpose() {
		const a = this.elements;

		const e11 = a[0];
		const e12 = a[3];
		const e13 = a[6];
		const e21 = a[1];
		const e22 = a[4];
		const e23 = a[7];
		const e31 = a[2];
		const e32 = a[5];
		const e33 = a[8];

		return this.set(e11, e12, e13, e21, e22, e23, e31, e32, e33);
	}

	inverse() {
		const det = this.determinant;

		if (Math.abs(det) < Number.EPSILON) {
			throw new Error(`[Matrix]: Cannot inverse, because matrix is singular [det=${det}].`);
		}

		const a = this.elements;

		const e11 = a[0];
		const e12 = a[3];
		const e13 = a[6];
		const e21 = a[1];
		const e22 = a[4];
		const e23 = a[7];
		const e31 = a[2];
		const e32 = a[5];
		const e33 = a[8];

		const c11 = e22 * e33 - e23 * e32;
		const c12 = -(e21 * e33 - e23 * e31);
		const c13 = e21 * e32 - e22 * e31;
		const c21 = -(e12 * e33 - e13 * e32);
		const c22 = e11 * e33 - e13 * e31;
		const c23 = -(e11 * e32 - e12 * e31);
		const c31 = e12 * e23 - e13 * e22;
		const c32 = -(e11 * e23 - e13 * e21);
		const c33 = e11 * e22 - e12 * e21;

		// biome-ignore format: It's easier to distinguish matrix columns.
		return this
			.set(
				c11, c21, c31,
				c12, c22, c32,
				c13, c23, c33
			)
			.transpose()
			.divideByScalar(det);
	}
}

export default Matrix3;
