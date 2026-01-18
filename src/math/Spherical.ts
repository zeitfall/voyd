import { clamp, lerp, modRadians } from '~/utils';

import { PI, PI_OVER_TWO, THREE_PI_OVER_TWO } from '~/constants';

import type Vector3 from './Vector3';

// https://en.wikipedia.org/wiki/Spherical_coordinate_system
class Spherical {
	static clone(spherical: Spherical) {
		return spherical.clone();
	}

	static fromCartesian(x: number, y: number, z: number) {
		return new Spherical().setFromCartesian(x, y, z);
	}

	static fromVector(vector: Vector3) {
		return new Spherical().setFromVector(vector);
	}

    constructor(public radius = 1, public theta = 0, public phi = 0) {}

	clone() {
		return new Spherical(...this);
	}

	copy(spherical: Spherical) {
		return this.set(spherical.radius, spherical.theta, spherical.phi);
	}

	setRadius(radius: number) {
		this.radius = radius;

		return this;
	}

	setTheta(theta: number) {
		this.theta = theta;

		return this;
	}

	setPhi(phi: number) {
		this.phi = phi;

		return this;
	}

	set(radius: number, theta: number, phi: number) {
		return this.setRadius(radius).setTheta(theta).setPhi(phi);
	}

	reset() {
		return this.set(1, 0, 0);
	}

	setFromCartesian(x: number, y: number, z: number) {
		const radius = Math.sqrt(x * x + y * y + z * z);

		if (radius === 0) {
			return this.reset();
		}

		const theta = Math.atan2(x, z);
		const phi = Math.asin(clamp(y / this.radius, -1, 1));

		return this.set(radius, theta, phi);
	}

	setFromVector(vector: Vector3) {
		return this.setFromCartesian(vector.x, vector.y, vector.z);
	}

	clamp(min: Spherical, max: Spherical) {
		return this.set(
			clamp(this.radius, min.radius, max.radius),
			clamp(this.theta, min.theta, max.theta),
			clamp(this.phi, min.phi, max.phi),
		);
	}

	lerp(spherical: Spherical, factor: number) {
		return this.set(
			lerp(this.radius, spherical.radius, factor),
			lerp(this.theta, spherical.theta, factor),
			lerp(this.phi, spherical.phi, factor),
		);
	}

	toCanonical() {
		if (this.radius === 0) {
			return this.setTheta(0).setPhi(0);
		}

		if (this.phi > PI_OVER_TWO) {
			this.phi += PI_OVER_TWO;
			this.phi = modRadians(this.phi);

			if (this.phi > PI) {
				this.theta += PI;
				this.phi = THREE_PI_OVER_TWO - this.phi;
			} else {
				this.phi -= PI_OVER_TWO;
			}
		}

		if (this.theta > PI) {
			this.theta += PI;
			this.theta = modRadians(this.theta);
			this.theta -= PI;
		}

		return this;
	}

	*[Symbol.iterator]() {
		yield this.radius;
		yield this.theta;
		yield this.phi;
	}
}

export default Spherical;
