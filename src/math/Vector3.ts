import Vector from './Vector';

import { lerp } from '~/utils';

import type Quaternion from './Quaternion';
import type Matrix3 from './Matrix3';

class Vector3 extends Vector {
	static cross(vectorA: Vector3, vectorB: Vector3) {
		return vectorA.clone().cross(vectorB);
	}

	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
	) {
		super();
	}

	clone() {
		return new Vector3(this.x, this.y, this.z);
	}

	copy(vector: Vector3) {
		return this.set(vector.x, vector.y, vector.z);
	}

	setX(x: number) {
		this.x = x;

		return this;
	}

	setY(y: number) {
		this.y = y;

		return this;
	}

	setZ(z: number) {
		this.z = z;

		return this;
	}

	set(x: number, y: number, z: number) {
		return this.setX(x).setY(y).setZ(z);
	}

	add(vector: Vector3) {
		return this.set(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	}

	subtract(vector: Vector3) {
		return this.set(this.x - vector.x, this.y - vector.y, this.z - vector.z);
	}

	lerp(vector: Vector3, fraction: number) {
		return this.set(
			lerp(this.x, vector.x, fraction),
			lerp(this.y, vector.y, fraction),
			lerp(this.z, vector.z, fraction)
		);
	}

	multiplyByMatrix(matrix: Matrix3): this {
		const a = matrix.elements;

		const e11 = a[0];
		const e12 = a[3];
		const e13 = a[6];
		const e21 = a[1];
		const e22 = a[4];
		const e23 = a[7];
		const e31 = a[2];
		const e32 = a[5];
		const e33 = a[8];

		const x = this.x;
		const y = this.y;
		const z = this.z;

		// biome-ignore format: It's easier to distinguish vector columns.
		return this.set(
			x * e11 + y * e12 + z * e13,
			x * e21 + y * e22 + z * e23,
			x * e31 + y * e32 + z * e33
		);
	}

	// https://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
	rotateByQuaternion(quaternion: Quaternion) {
		const quaternionLength = quaternion.length;

		if (Math.abs(quaternionLength - 1) > Number.EPSILON) {
			throw new Error(`[Vector3]: Quaternion must be normalized, length=${quaternionLength} is given.`);
		}

		const vx = this.x;
		const vy = this.y;
		const vz = this.z;

		const qx = quaternion.x;
		const qy = quaternion.y;
		const qz = quaternion.z;
		const qw = quaternion.w;

		const cx = 2 * (qy * vz - qz * vy);
		const cy = 2 * (qz * vx - qx * vz);
		const cz = 2 * (qx * vy - qy * vx);

		// biome-ignore format: It's easier to distinguish vector columns.
		return this.set(
			vx + qw * cx + qy * cz - qz * cy,
			vy + qw * cy + qz * cx - qx * cz,
			vz + qw * cz + qx * cy - qy * cx
		);
	}

	cross(vector: Vector3) {
		return this.set(
			this.y * vector.z - this.z * vector.y,
			this.z * vector.x - this.x * vector.z,
			this.x * vector.y - this.y * vector.x,
		);
	}

	scale(scaleX: number, scaleY?: number, scaleZ?: number) {
		const sx = scaleX;
		const sy = scaleY ?? scaleX;
		const sz = scaleZ ?? scaleY ?? scaleX;

		return this.set(sx * this.x, sy * this.y, sz * this.z);
	}

	dot(vector: Vector3) {
		return this.x * vector.x + this.y * vector.y + this.z * vector.z;
	}

	distanceToSquared(vector: Vector3) {
		const dx = vector.x - this.x;
		const dy = vector.y - this.y;
		const dz = vector.z - this.z;

		return dx * dx + dy * dy + dz * dz;
	}

	equals(vector: Vector3, tolerance = 0) {
		return (
			Math.abs(vector.x - this.x) <= tolerance &&
			Math.abs(vector.y - this.y) <= tolerance &&
			Math.abs(vector.z - this.z) <= tolerance
		);
	}

	toArray() {
		return [this.x, this.y, this.z];
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}

export default Vector3;
