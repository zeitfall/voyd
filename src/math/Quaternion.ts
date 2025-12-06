import { clamp } from '~/utils';

import type Vector3 from './Vector3';
import type Matrix3 from './Matrix3';

class Quaternion {
	static clone(vector: Quaternion) {
		return vector.clone();
	}

	static fromAxisAngle(axis: Vector3, angle: number) {
		return new Quaternion().setFromAxisAngle(axis, angle);
	}

	static fromDifference(quaternion: Quaternion) {
		return new Quaternion().setFromDifference(quaternion);
	}

	static fromMatrix(matrix: Matrix3) {
		return new Quaternion().setFromMatrix(matrix);
	}

	static multiply(quaternionA: Quaternion, quaternionB: Quaternion) {
		return quaternionA.clone().multiply(quaternionB);
	}

	static premultiply(quaternionA: Quaternion, quaternionB: Quaternion) {
		return quaternionA.clone().premultiply(quaternionB);
	}

	static slerp(quaternionA: Quaternion, quaternionB: Quaternion, fraction: number) {
		return quaternionA.clone().slerp(quaternionB, fraction);
	}

	static normalize(quaternion: Quaternion) {
		return quaternion.clone().normalize();
	}

	static negate(quaternion: Quaternion) {
		return quaternion.clone().negate();
	}

	static conjugate(quaternion: Quaternion) {
		return quaternion.clone().conjugate();
	}

	static invert(quaternion: Quaternion) {
		return quaternion.clone().invert();
	}

	static log(quaternion: Quaternion) {
		return quaternion.clone().log();
	}

	static exp(quaternion: Quaternion) {
		return quaternion.clone().exp();
	}

	static pow(quaternion: Quaternion, exponent: number) {
		return quaternion.clone().pow(exponent);
	}

	static dot(quaternionA: Quaternion, quaternionB: Quaternion) {
		return quaternionA.dot(quaternionB);
	}

	static angleBetween(quaternionA: Quaternion, quaternionB: Quaternion) {
		return quaternionA.angleTo(quaternionB);
	}

	static equals(quaternionA: Quaternion, quaternionB: Quaternion, tolerance?: number) {
		return quaternionA.equals(quaternionB, tolerance);
	}

	static notEquals(quaternionA: Quaternion, quaternionB: Quaternion, tolerance?: number) {
		return quaternionA.notEquals(quaternionB, tolerance);
	}

	static toArray(quaternion: Quaternion) {
		return quaternion.toArray();
	}

	static toString(quaternion: Quaternion) {
		return quaternion.toString();
	}

	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 1,
	) {}

	get lengthSquared() {
		return this.dot(this);
	}

	get length() {
		return Math.sqrt(this.lengthSquared);
	}

	set length(length: number) {
		this.setLength(length);
	}

	setLength(length: number) {
		return this.normalize().scale(length);
	}

	clone() {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	copy(quaternion: Quaternion) {
		return this.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
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

	setFromAxisAngle(axis: Vector3, angle: number) {
		const alpha = angle / 2;
		const cosAlpha = Math.cos(alpha);
		const sinAlpha = Math.sin(alpha);

		return this.set(sinAlpha * axis.x, sinAlpha * axis.y, sinAlpha * axis.z, cosAlpha);
	}

	setFromDifference(quaternion: Quaternion) {
		return this.invert().premultiply(quaternion);
	}

	setFromMatrix(matrix: Matrix3) {
		const a = matrix.elements;

		const m11 = a[0];
		const m12 = a[3];
		const m13 = a[6];
		const m21 = a[1];
		const m22 = a[4];
		const m23 = a[7];
		const m31 = a[2];
		const m32 = a[5];
		const m33 = a[8];

		let x;
		let y;
		let z;
		let w;

		let tr = m11 + m22 + m33;

		if (tr > 0) {

			const s = 0.5 / Math.sqrt(tr + 1);

			w = 0.25 / s;
			x = (m32 - m23) * s;
			y = (m13 - m31) * s;
			z = (m21 - m12) * s;
		}
		else if (m11 > m22 && m11 > m33) {
			const s = 0.5 / Math.sqrt(1 + m11 - m22 - m33);

			w = (m32 - m23) * s;
			x = 0.25 / s;
			y = (m12 + m21) * s;
			z = (m13 + m31) * s;
		}
		else if (m22 > m33) {
			const s = 0.5 / Math.sqrt(1 + m22 - m11 - m33);

			w = (m13 - m31) * s;
			x = (m12 + m21) * s;
			y = 0.25 / s;
			z = (m23 + m32) * s;

		} else {
			const s = 0.5 / Math.sqrt(1 + m33 - m11 - m22);

			w = (m21 - m12) * s;
			x = (m13 + m31) * s;
			y = (m23 + m32) * s;
			z = 0.25 / s;
		}

		return this.set(x, y, z, w);
	}

	reset() {
		return this.set(0, 0, 0, 1);
	}

	multiply(quaternion: Quaternion, premultiply = false) {
		const q0 = premultiply ? quaternion : this;
		const q1 = premultiply ? this : quaternion;

		const q0x = q0.x;
		const q0y = q0.y;
		const q0z = q0.z;
		const q0w = q0.w;

		const q1x = q1.x;
		const q1y = q1.y;
		const q1z = q1.z;
		const q1w = q1.w;

		return this.set(
			q0w * q1x + q0x * q1w + q0y * q1z - q0z * q1y,
			q0w * q1y + q0y * q1w + q0z * q1x - q0x * q1z,
			q0w * q1z + q0z * q1w + q0x * q1y - q0y * q1x,
			q0w * q1w - q0x * q1x - q0y * q1y - q0z * q1z,
		);
	}

	premultiply(quaternion: Quaternion) {
		return this.multiply(quaternion, true);
	}

	slerp(quaternion: Quaternion, fraction: number) {
		const t = clamp(fraction, 0, 1);

		const q0x = this.x;
		const q0y = this.y;
		const q0z = this.z;
		const q0w = this.w;

		let q1x = quaternion.x;
		let q1y = quaternion.y;
		let q1z = quaternion.z;
		let q1w = quaternion.w;

		let k0 = 0;
		let k1 = 0;

		const cosAlpha = this.dot(quaternion);

		if (cosAlpha < 0) {
			q1x *= -1;
			q1y *= -1;
			q1z *= -1;
			q1w *= -1;
		}

		if (cosAlpha > 0.999) {
			k0 = 1 - t;
			k1 = t;
		} else {
			const sinAlpha = Math.sqrt(1 - cosAlpha * cosAlpha);
			const inverseSinAlpha = 1 / sinAlpha;
			const alpha = Math.atan2(sinAlpha, cosAlpha);

			k0 = Math.sin((1 - t) * alpha) * inverseSinAlpha;
			k1 = Math.sin(t * alpha) * inverseSinAlpha;
		}

		return this.set(k0 * q0x + k1 * q1x, k0 * q0y + k1 * q1y, k0 * q0z + k1 * q1z, k0 * q0w + k1 * q1w);
	}

	scale(scaleX: number, scaleY?: number, scaleZ?: number, scaleW?: number) {
		const sx = scaleX;
		const sy = scaleY ?? scaleX;
		const sz = scaleZ ?? scaleY ?? scaleX;
		const sw = scaleW ?? scaleZ ?? scaleY ?? scaleX;

		return this.set(sx * this.x, sy * this.y, sz * this.z, sw * this.w);
	}

	multiplyByScalar(scalar: number) {
		return this.scale(scalar);
	}

	divideByScalar(scalar: number) {
		if (Math.abs(scalar) < Number.EPSILON) {
			throw new Error('[Quaternion]: Cannot divide by zero.');
		}

		return this.multiplyByScalar(1 / scalar);
	}

	normalize() {
		return this.divideByScalar(this.length);
	}

	negate() {
		return this.multiplyByScalar(-1);
	}

	conjugate() {
		return this.set(-this.x, -this.y, -this.z, this.w);
	}

	invert() {
		return this.conjugate().normalize();
	}

	log() {
		const qx = this.x;
		const qy = this.y;
		const qz = this.z;
		const qw = this.w;

		const length = Math.sqrt(qx * qx + qy * qy + qz * qz);

		if (length === 0) {
			return this.multiplyByScalar(0);
		}

		const alpha = Math.acos(clamp(qw, -1, 1));

		return this.scale(alpha / length, undefined, undefined, 0);
	}

	exp() {
		const qx = this.x;
		const qy = this.y;
		const qz = this.z;

		const length = Math.sqrt(qx * qx + qy * qy + qz * qz);
		const cosLength = Math.cos(length);
		const sinLength = Math.sin(length);

		if (length === 0) {
			return this.setW(cosLength);
		}

		return this.scale(sinLength / length).setW(cosLength);
	}

	pow(exponent: number) {
		return this.log().multiplyByScalar(exponent).exp();
	}

	dot(quaternion: Quaternion) {
		return this.x * quaternion.x + this.y * quaternion.y + this.z * quaternion.z + this.w * quaternion.w;
	}

	angleTo(quaternion: Quaternion) {
		return 2 * Math.acos(clamp(this.dot(quaternion), -1, 1));
	}

	equals(quaternion: Quaternion, tolerance = 0) {
		return (
			Math.abs(quaternion.x - this.x) <= tolerance &&
			Math.abs(quaternion.y - this.y) <= tolerance &&
			Math.abs(quaternion.z - this.z) <= tolerance &&
			Math.abs(quaternion.w - this.w) <= tolerance
		);
	}

	notEquals(quaternion: Quaternion, tolerance?: number) {
		return !this.equals(quaternion, tolerance);
	}

	toArray() {
		return [this.x, this.y, this.z, this.w];
	}

	toString() {
		return this.toArray().toString();
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}

export default Quaternion;
