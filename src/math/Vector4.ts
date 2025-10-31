import Vector from './Vector';

import { lerp } from '~/utils';

import type Matrix4 from './Matrix4';

class Vector4 extends Vector {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 0,
	) {
		super();
	}

	clone() {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	copy(vector: Vector4) {
		return this.set(vector.x, vector.y, vector.z, vector.w);
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

	setW(w: number) {
		this.w = w;

		return this;
	}

	set(x: number, y: number, z: number, w: number) {
		return this.setX(x).setY(y).setZ(z).setW(w);
	}

	add(vector: Vector4) {
		return this.set(this.x + vector.x, this.y + vector.y, this.z + vector.z, this.w + vector.w);
	}

	subtract(vector: Vector4) {
		return this.set(this.x - vector.x, this.y - vector.y, this.z - vector.z, this.w - vector.w);
	}

	lerp(vector: Vector4, fraction: number) {
		return this.set(
			lerp(this.x, vector.x, fraction),
			lerp(this.y, vector.y, fraction),
			lerp(this.z, vector.z, fraction),
			lerp(this.w, vector.w, fraction)
		);
	}

	multiplyByMatrix(matrix: Matrix4): this {
		const a = matrix.elements;

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

		const x = this.x;
		const y = this.y;
		const z = this.z;
		const w = this.w;

		return this.set(
			x * e11 + y * e12 + z * e13 + w * e14,
			x * e21 + y * e22 + z * e23 + w * e24,
			x * e31 + y * e32 + z * e33 + w * e34,
			x * e41 + y * e42 + z * e43 + w * e44,
		);
	}

	scale(scaleX: number, scaleY?: number, scaleZ?: number, scaleW?: number) {
		const sx = scaleX;
		const sy = scaleY ?? scaleX;
		const sz = scaleZ ?? scaleY ?? scaleX;
		const sw = scaleW ?? scaleZ ?? scaleY ?? scaleX;

		return this.set(sx * this.x, sy * this.y, sz * this.z, sw * this.w);
	}

	dot(vector: Vector4) {
		return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
	}

	distanceToSquared(vector: Vector4) {
		const dx = vector.x - this.x;
		const dy = vector.y - this.y;
		const dz = vector.z - this.z;
		const dw = vector.w - this.w;

		return dx * dx + dy * dy + dz * dz + dw * dw;
	}

	equals(vector: Vector4, tolerance = 0) {
		return (
			Math.abs(vector.x - this.x) <= tolerance &&
			Math.abs(vector.y - this.y) <= tolerance &&
			Math.abs(vector.z - this.z) <= tolerance &&
			Math.abs(vector.w - this.w) <= tolerance
		);
	}

	toArray() {
		return [this.x, this.y, this.z, this.w];
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}

export default Vector4;
