import type Matrix2 from './Matrix2';
import Vector from './Vector';

class Vector2 extends Vector {
	constructor(
		public x = 0,
		public y = 0,
	) {
		super();
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	copy(vector: Vector2) {
		return this.set(vector.x, vector.y);
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;

		return this;
	}

	setX(x: number) {
		this.x = x;

		return this;
	}

	setY(y: number) {
		this.y = y;

		return this;
	}

	add(vector: Vector2) {
		return this.set(this.x + vector.x, this.y + vector.y);
	}

	subtract(vector: Vector2) {
		return this.set(this.x - vector.x, this.y - vector.y);
	}

	premultiplyByMatrix(matrix: Matrix2) {
		const x = this.x;
		const y = this.y;
		const a = matrix.elements;

		const e11 = a[0];
		const e12 = a[2];
		const e21 = a[1];
		const e22 = a[3];

		return this.set(x * e11 + y * e12, x * e21 + y * e22);
	}

	scale(scaleX: number, scaleY?: number) {
		const sx = scaleX;
		const sy = scaleY ?? scaleX;

		return this.set(sx * this.x, sy * this.y);
	}

	dot(vector: Vector2) {
		return this.x * vector.x + this.y * vector.y;
	}

	distanceToSquared(vector: Vector2) {
		const dx = vector.x - this.x;
		const dy = vector.y - this.y;

		return dx * dx + dy * dy;
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
