import { clamp, lerp, modRadians } from '~/utils';

import { PI, TWO_PI } from '~/constants';

import type Vector2 from './Vector2';

// https://en.wikipedia.org/wiki/Polar_coordinate_system
class Polar {
	static fromCartesian(x: number, y: number) {
		return new Polar().setFromCartesian(x, y);
	}

	static fromVector(vector: Vector2) {
		return new Polar().setFromVector(vector);
	}

	constructor(public radius = 1, public theta = 0) {}

	clone() {
		return new Polar(...this);
	}

	copy(polar: Polar) {
		return this.set(polar.radius, polar.theta);
	}

	setRadius(radius: number) {
		this.radius = radius;

		return this;
	}

	setTheta(theta: number) {
		this.theta = theta;

		return this;
	}

	set(radius: number, theta: number) {
		return this.setRadius(radius).setTheta(theta);
	}

	reset() {
		return this.set(1, 0);
	}

	setFromCartesian(x: number, y: number) {
		this.radius = Math.sqrt(x * x + y * y);

		if (this.radius === 0) {
			return this.setTheta(0);
		}

		return this.setTheta(Math.atan2(y, x));
	}

	setFromVector(vector: Vector2) {
		return this.setFromCartesian(vector.x, vector.y);
	}

	clamp(min: Polar, max: Polar) {
		return this.set(clamp(this.radius, min.radius, max.radius), clamp(this.theta, min.theta, max.theta));
	}

	lerp(polar: Polar, fraction: number) {
		return this.set(lerp(this.radius, polar.radius, fraction), lerp(this.theta, polar.theta, fraction));
	}

	toCanonical() {
		if (this.radius === 0) {
			return this.setTheta(0);
		}

		if (this.radius < 0) {
			this.radius = -this.radius;
			this.theta += PI;
		}

		if (this.theta > TWO_PI) {
			this.theta += PI;
			this.theta = modRadians(this.theta);
			this.theta -= PI;
		}

		return this;
	}

	*[Symbol.iterator]() {
		yield this.radius;
		yield this.theta;
	}
}

export default Polar;
