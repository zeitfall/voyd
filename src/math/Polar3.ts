import Polar from './Polar';

import { clamp, modRadians } from '~/utils';

import { PI_OVER_TWO, THREE_PI_OVER_TWO } from '~/constants';

import type Vector3 from './Vector3';

// https://en.wikipedia.org/wiki/Spherical_coordinate_system
class Polar3 extends Polar {
    constructor(radius?: number, theta?: number, public phi = 0) {
        super(radius, theta);
    }

    clone() {
        return new Polar3(...this);
    }

    copy(polar: Polar3) {
        return this.set(polar.radius, polar.theta, polar.phi);
    }

    setPhi(phi: number) {
        this.phi = phi;

        return this;
    }

    set(radius: number, theta: number, phi: number) {
        return this.setRadius(radius).setTheta(theta).setPhi(phi);
    }

    setFromCartesian(x: number, y: number, z: number) {
        this.radius = Math.sqrt(x * x + y * y + z * z);

        if (this.radius === 0) {
            return this.setTheta(0).setPhi(0);
        }

        const theta = Math.atan2(x, z);
        const phi = Math.asin(clamp(-y / this.radius, -1, 1));

        return this.setTheta(theta).setPhi(phi);
    }

    setFromVector(vector: Vector3) {
        return this.setFromCartesian(vector.x, vector.y, vector.z);
    }

    toCanonical() {
        if (this.radius === 0) {
            return this.setTheta(0).setPhi(0);
        }

        if (this.phi > PI_OVER_TWO) {
            this.phi += PI_OVER_TWO;
            this.phi = modRadians(this.phi);

            if (this.phi > Math.PI) {
                this.theta += Math.PI;
                this.phi = THREE_PI_OVER_TWO - this.phi;
            }
            else {
                this.phi -= PI_OVER_TWO;
            }
        }

        if (this.theta > Math.PI) {
            this.theta += Math.PI;
            this.theta = modRadians(this.theta);
            this.theta -= Math.PI;
        }

        return this;
    }

    *[Symbol.iterator]() {
        yield this.radius;
        yield this.theta;
        yield this.phi;
    }
}

export default Polar3;
