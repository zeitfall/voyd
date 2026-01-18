import Vector from './Vector';

import { defineReadOnlyProperties, clamp, lerp, damp } from '~/utils';

import type Spherical from './Spherical';
import type Quaternion from './Quaternion';
import type Matrix3 from './Matrix3';

class Vector3 extends Vector {
	declare static RIGHT: Vector3;
	declare static UP: Vector3;
	declare static FORWARD: Vector3;

	static {
		const RIGHT = new Vector3(1, 0, 0);
		const UP = new Vector3(0, 1, 0);
		const FORWARD = new Vector3(0, 0, 1);

		Object.freeze(RIGHT);
		Object.freeze(UP);
		Object.freeze(FORWARD)

		defineReadOnlyProperties(Vector3, { RIGHT, UP, FORWARD });
	}
	
	static fromSphericalCoordinates(radius: number, theta: number, phi: number) {
		return new Vector3().setFromSphericalCoordinates(radius, theta, phi);
	}

	static fromSpherical(spherical: Spherical) {
		return new Vector3().setFromSpherical(spherical);
	}

	static multiplyByQuaternion(vector: Vector3, quaternion: Quaternion) {
		return vector.clone().multiplyByQuaternion(quaternion);
	}

	static cross(vectorA: Vector3, vectorB: Vector3) {
		return vectorA.clone().cross(vectorB);
	}
	
	static projectOnPlane(vector: Vector3, planeNormal: Vector3) {
		return vector.clone().projectOnPlane(planeNormal);
	}

	constructor(public x = 0, public y = 0, public z = 0) {
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

	reset() {
		return this.set(0, 0, 0);
	}

	setFromSphericalCoordinates(radius: number, theta: number, phi: number) {
		const sinTheta = Math.sin(theta);
		const cosTheta = Math.cos(theta);
		const cosPhi = Math.cos(phi);
		const sinPhi = Math.sin(phi);

		return this.set(
			radius * cosPhi * sinTheta,
			radius * sinPhi,
			radius * cosPhi * cosTheta
		);
	}

	setFromSpherical(spherical: Spherical) {
		const { radius, theta, phi } = spherical;

		return this.setFromSphericalCoordinates(radius, theta, phi);
	}

	add(vector: Vector3) {
		return this.set(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	}

	subtract(vector: Vector3) {
		return this.set(this.x - vector.x, this.y - vector.y, this.z - vector.z);
	}

	clamp(min: Vector3, max: Vector3) {
		return this.set(
			clamp(this.x, min.x, max.x),
			clamp(this.y, min.y, max.y),
			clamp(this.z, min.z, max.z)
		);
	}

	lerp(vector: Vector3, factor: number) {
		return this.set(
			lerp(this.x, vector.x, factor),
			lerp(this.y, vector.y, factor),
			lerp(this.z, vector.z, factor)
		);
	}

	damp(vector: Vector3, lambda: number, deltaTime: number) {
		return this.set(
			damp(this.x, vector.x, lambda, deltaTime),
			damp(this.y, vector.y, lambda, deltaTime),
			damp(this.z, vector.z, lambda, deltaTime),
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

		return this.set(
			x * e11 + y * e12 + z * e13,
			x * e21 + y * e22 + z * e23,
			x * e31 + y * e32 + z * e33
		);
	}

	// https://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
	multiplyByQuaternion(quaternion: Quaternion) {
		const qL = quaternion.length;

		if (Math.abs(qL - 1) > Number.EPSILON) {
			throw new Error(`[Vector3]: Quaternion must be normalized, length=${qL} is given.`);
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

	projectOnPlane(planeNormal: Vector3) {
		const vx = this.x;
		const vy = this.y;
		const vz = this.z;

		let nx = 0;
		let ny = 0;
		let nz = 0;
		const nLSq = planeNormal.lengthSquared;

		// NOTE: It has been taken from Vector.prototype.projectOnVector.
		if (nLSq > 0) {
			const normFactor = this.dot(planeNormal) / nLSq;

			nx = planeNormal.x * normFactor;
			ny = planeNormal.y * normFactor;
			nz = planeNormal.z * normFactor;
		}

		return this.set(vx - nx, vy - ny, vz - nz);
	}

	scaleX(scalar: number) {
		this.x *= scalar;

		return this;
	}

	scaleY(scalar: number) {
		this.y *= scalar;

		return this;
	}

	scaleZ(scalar: number) {
		this.z *= scalar;

		return this;
	}

	scale(scalarX: number, scalarY?: number, scalarZ?: number) {
		const sx = scalarX;
		const sy = scalarY ?? scalarX;
		const sz = scalarZ ?? scalarY ?? scalarX;
	
		return this.scaleX(sx).scaleY(sy).scaleZ(sz);
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
