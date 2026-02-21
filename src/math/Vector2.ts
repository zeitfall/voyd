import Vector from './Vector';

import { defineReadOnlyProperties, clamp, lerp, damp } from '~/utils';

import type Polar from './Polar';
import type Matrix2 from './Matrix2';

class Vector2 extends Vector {
	declare static RIGHT: Vector2;
	declare static UP: Vector2;

	static {
		const RIGHT = new Vector2(1, 0);
		const UP = new Vector2(0, 1);

		Object.freeze(RIGHT);
		Object.freeze(UP);

		defineReadOnlyProperties(Vector2, { RIGHT, UP });
	}

	static fromPolarCoordinates(radius: number, theta: number) {
		return new Vector2().setFromPolarCoordinates(radius, theta);
	}

	static fromPolar(polar: Polar) {
		return new Vector2().setFromPolar(polar);
	}

	constructor(public x = 0, public y = 0) {
		super();
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	copy(vector: Vector2) {
		return this.set(vector.x, vector.y);
	}

	set(x: number, y: number) {
		return this.setX(x).setY(y);
	}

	reset() {
		return this.set(0, 0);
	}

	setX(x: number) {
		this.x = x;
		return this;
	}

	setY(y: number) {
		this.y = y;
		return this;
	}

	setFromPolarCoordinates(radius: number, theta: number) {
		return this.set(radius * Math.cos(theta), radius * Math.sin(theta));
	}

	setFromPolar(polar: Polar) {
		const { radius, theta } = polar;
		return this.setFromPolarCoordinates(radius, theta);
	}

	add(vector: Vector2) {
		return this.set(this.x + vector.x, this.y + vector.y);
	}

	subtract(vector: Vector2) {
		return this.set(this.x - vector.x, this.y - vector.y);
	}

	scale(scalarX: number, scalarY?: number) {
		const sx = scalarX;
		const sy = scalarY ?? scalarX;

		return this.scaleX(sx).scaleY(sy);
	}

	scaleX(scalar: number) {
		this.x *= scalar;

		return this;
	}

	scaleY(scalar: number) {
		this.y *= scalar;

		return this;
	}

	dot(vector: Vector2) {
		return this.x * vector.x + this.y * vector.y;
	}

	distanceToSquared(vector: Vector2) {
		const dx = vector.x - this.x;
		const dy = vector.y - this.y;

		return dx * dx + dy * dy;
	}

	clamp(min: Vector2, max: Vector2) {
		return this.set(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
	}

	lerp(vector: Vector2, factor: number) {
		return this.set(lerp(this.x, vector.x, factor), lerp(this.y, vector.y, factor));
	}

	damp(vector: Vector2, lambda: number, deltaTime: number) {
		return this.set(damp(this.x, vector.x, lambda, deltaTime), damp(this.y, vector.y, lambda, deltaTime));
	}

	multiplyByMatrix(matrix: Matrix2) {
		const x = this.x;
		const y = this.y;

		const a = matrix.elements;

		const e11 = a[0];
		const e12 = a[2];
		const e21 = a[1];
		const e22 = a[3];

		return this.set(x * e11 + y * e12, x * e21 + y * e22);
	}

	equals(vector: Vector2, tolerance = 0) {
		return Math.abs(vector.x - this.x) <= tolerance && Math.abs(vector.y - this.y) <= tolerance;
	}

	toArray() {
		return [this.x, this.y];
	}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}

export default Vector2;
