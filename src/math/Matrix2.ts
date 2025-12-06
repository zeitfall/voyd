import Matrix from './Matrix';

import type Vector2 from './Vector2';
import type { ArrayOf } from '~/types';

type Matrix2Elements = ArrayOf<number, 4>;

class Matrix2 extends Matrix<Matrix2Elements> {
	static fromArray(array: Matrix2Elements) {
		return new Matrix2().setFromArray(array);
	}

	static fromVectors(vectorA: Vector2, vectorB: Vector2) {
		return new Matrix2().setFromVectors(vectorA, vectorB);
	}

	constructor() {
		super();
	}

	get determinant() {
		const a = this.elements;

		const a11 = a[0];
		const a12 = a[2];
		const a21 = a[1];
		const a22 = a[3];

		return a11 * a22 - a12 * a21;
	}

	clone() {
		return new Matrix2().set(...this.elements);
	}

	set(...elements: Matrix2Elements) {
		const a = this.elements;
		const b = elements;

		a[0] = b[0];
		a[1] = b[1];
		a[2] = b[2];
		a[3] = b[3];

		return this;
	}

	setFromVectors(vectorA: Vector2, vectorB: Vector2) {
		return this.set(vectorA.x, vectorA.y, vectorB.x, vectorB.y);
	}

	identity() {
		return this.set(1, 0, 0, 1);
	}

	add(matrix: Matrix2) {
		const a = this.elements;
		const b = matrix.elements;

		return this.set(a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]);
	}

	subtract(matrix: Matrix2) {
		const a = this.elements;
		const b = matrix.elements;

		return this.set(a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]);
	}

	multiply(matrix: Matrix2, premultiply = false) {
		const a = premultiply ? matrix.elements : this.elements;
		const b = premultiply ? this.elements : matrix.elements;

		const a11 = a[0];
		const a12 = a[2];
		const a21 = a[1];
		const a22 = a[3];

		const b11 = b[0];
		const b12 = b[2];
		const b21 = b[1];
		const b22 = b[3];

		// biome-ignore format: It's easier to distinguish matrix columns.
		return this.set(
			a11 * b11 + a12 * b21, a21 * b11 + a22 * b21,
			a11 * b12 + a12 * b22, a21 * b12 + a22 * b22,
		);
	}

	multiplyByScalar(scalar: number) {
		const a = this.elements;

		// biome-ignore format: It's easier to distinguish matrix columns.
		return this.set(
			scalar * a[0],
			scalar * a[1],
			scalar * a[2],
			scalar * a[3],
		);
	}

	transpose() {
		const a = this.elements;

		const e11 = a[0];
		const e12 = a[2];
		const e21 = a[1];
		const e22 = a[3];

		return this.set(e11, e12, e21, e22);
	}

	inverse() {
		const det = this.determinant;

		if (Math.abs(det) < Number.EPSILON) {
			throw new Error(`[Matrix]: Cannot inverse, because matrix is singular [det=${det}].`);
		}

		const a = this.elements;

		const e11 = a[0];
		const e12 = a[2];
		const e21 = a[1];
		const e22 = a[3];

		const c11 = e22;
		const c12 = -e21;
		const c21 = -e12;
		const c22 = e11;

		return this.set(c11, c21, c12, c22).transpose().divideByScalar(det);
	}
}

export default Matrix2;
