import Matrix from './Matrix';

import type Vector3 from './Vector3';
import type Vector4 from './Vector4';
import type Quaternion from './Quaternion';

class Matrix4 extends Matrix {

	static fromVectors(vectorA: Vector4, vectorB: Vector4, vectorC: Vector4, vectorD: Vector4) {
		return new Matrix4().setFromVectors(vectorA, vectorB, vectorC, vectorD);
	}

	constructor() {
		super(16);
	}

	get determinant() {
		const a = this.array;

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
		return new Matrix4().copy(this);
	}

	set(
		e11: number, e21: number, e31: number, e41: number,
		e12: number, e22: number, e32: number, e42: number,
		e13: number, e23: number, e33: number, e43: number,
		e14: number, e24: number, e34: number, e44: number
	) {
		const a = this.array;

		a[0] = e11;
		a[1] = e21;
		a[2] = e31;
		a[3] = e41;
		a[4] = e12;
		a[5] = e22;
		a[6] = e32;
		a[7] = e42;
		a[8] = e13;
		a[9] = e23;
		a[10] = e33;
		a[11] = e43;
		a[12] = e14;
		a[13] = e24;
		a[14] = e34;
		a[15] = e44;

		return this;
	}

	setFromVectors(vectorA: Vector4, vectorB: Vector4, vectorC: Vector4, vectorD: Vector4) {
		return this.set(
			vectorA.x, vectorA.y, vectorA.z, vectorA.w,
			vectorB.x, vectorB.y, vectorB.z, vectorB.w,
			vectorC.x, vectorC.y, vectorC.z, vectorC.w,
			vectorD.x, vectorD.y, vectorD.z, vectorD.w,
		);
	}

	setFromTRS(translation: Vector3, rotation: Quaternion, scale: Vector3) {
		const tx = translation.x;
		const ty = translation.y;
		const tz = translation.z;

		const rx = rotation.x;
		const ry = rotation.y;
		const rz = rotation.z;
		const rw = rotation.w;

		const rx2 = rx * rx;
		const ry2 = ry * ry;
		const rz2 = rz * rz;

		const rxy = rx * ry;
		const rxz = rx * rz;
		const rxw = rx * rw;
		const ryz = ry * rz;
		const ryw = ry * rw;
		const rzw = rz * rw;
	
		const sx = scale.x;
		const sy = scale.y;
		const sz = scale.z;

		// The algorithm has been taken from Matrix3.prototype.setFromQuaternion.
		const r11 = 1 - 2 * (ry2 + rz2);
		const r12 = 2 * (rxy - rzw);
		const r13 = 2 * (ryw + rxz);
		const r21 = 2 * (rxy + rzw);
		const r22 = 1 - 2 * (rx2 + rz2);
		const r23 = 2 * (ryz - rxw);
		const r31 = 2 * (rxz - ryw);
		const r32 = 2 * (rxw + ryz);
		const r33 = 1 - 2 * (rx2 + ry2);

		// rx ry rz 0 <- "right" basis vector
		// ux uy uz 0 <- "up" basis vector
		// fx fy fz 0 <- "forward" basis vector
		// tx ty tz 1
		return this.set(
			sx * r11, sx * r21, sx * r31, 0,
			sy * r12, sy * r22, sy * r32, 0,
			sz * r13, sz * r23, sz * r33, 0,
			tx, ty, tz, 1
		);
	}

	identity() {
		return this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
	}

	add(matrix: Matrix4) {
		const a = this.array;
		const b = matrix.array;

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
		const a = this.array;
		const b = matrix.array;

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
		const a = premultiply ? matrix.array : this.array;
		const b = premultiply ? this.array : matrix.array;

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
		const a = this.array;

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
		const a = this.array;

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

	inverse() {
		const det = this.determinant;

		if (Math.abs(det) < Number.EPSILON) {
			throw new Error(`[Matrix]: Cannot inverse, because matrix is singular [det=${det}].`);
		}

		const a = this.array;

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

		const c11 = e22 * (e33 * e44 - e34 * e43) - e23 * (e32 * e44 - e34 * e42) + e24 * (e32 * e43 - e33 * e42);
		const c12 = -(e21 * (e33 * e44 - e34 * e43) - e23 * (e31 * e44 - e34 * e41) + e24 * (e31 * e43 - e33 * e41));
		const c13 = e21 * (e32 * e44 - e34 * e42) - e22 * (e31 * e44 - e34 * e41) + e24 * (e31 * e42 - e32 * e41);
		const c14 = -(e21 * (e32 * e43 - e33 * e42) - e22 * (e31 * e43 - e33 * e41) + e23 * (e31 * e42 - e32 * e41));

		const c21 = -(e12 * (e33 * e44 - e34 * e43) - e13 * (e32 * e44 - e34 * e42) + e14 * (e32 * e43 - e33 * e42));
		const c22 = e11 * (e33 * e44 - e34 * e43) - e13 * (e31 * e44 - e34 * e41) + e14 * (e31 * e43 - e33 * e41);
		const c23 = -(e11 * (e32 * e44 - e34 * e42) - e12 * (e31 * e44 - e34 * e41) + e14 * (e31 * e42 - e32 * e41));
		const c24 = e11 * (e32 * e43 - e33 * e42) - e12 * (e31 * e43 - e33 * e41) + e13 * (e31 * e42 - e32 * e41);

		const c31 = e12 * (e23 * e44 - e24 * e43) - e13 * (e22 * e44 - e24 * e42) + e14 * (e22 * e43 - e23 * e42);
		const c32 = -(e11 * (e23 * e44 - e24 * e43) - e13 * (e21 * e44 - e24 * e41) + e14 * (e21 * e43 - e23 * e41));
		const c33 = e11 * (e22 * e44 - e24 * e42) - e12 * (e21 * e44 - e24 * e41) + e14 * (e21 * e42 - e22 * e41);
		const c34 = -(e11 * (e22 * e43 - e23 * e42) - e12 * (e21 * e43 - e23 * e41) + e13 * (e21 * e42 - e22 * e41));

		const c41 = -(e12 * (e23 * e34 - e24 * e33) - e13 * (e22 * e34 - e24 * e32) + e14 * (e22 * e33 - e23 * e32));
		const c42 = e11 * (e23 * e34 - e24 * e33) - e13 * (e21 * e34 - e24 * e31) + e14 * (e21 * e33 - e23 * e31);
		const c43 = -(e11 * (e22 * e34 - e24 * e32) - e12 * (e21 * e34 - e24 * e31) + e14 * (e21 * e32 - e22 * e31));
		const c44 = e11 * (e22 * e33 - e23 * e32) - e12 * (e21 * e33 - e23 * e31) + e13 * (e21 * e32 - e22 * e31);

		return this.set(
			c11, c12, c13, c14,
			c21, c22, c23, c24,
			c31, c32, c33, c34,
			c41, c42, c43, c44
		).divideByScalar(det);
	}
}

export default Matrix4;
