import Polar from './Polar';

import { modRadians } from '~/utils';

import { TWO_PI } from '~/constants';

import type Vector2 from './Vector2';

// https://en.wikipedia.org/wiki/Polar_coordinate_system
class Polar2 extends Polar {
    static fromCartesian(x: number, y: number) {
        return new Polar2().setFromCartesian(x, y);
    }

    static fromVector(vector: Vector2) {
        return new Polar2().setFromVector(vector);
    }

    // biome-ignore lint/complexity/noUselessConstructor: We have to pass parameters to parent class.
    constructor(radius?: number, theta?: number) {
        super(radius, theta);
    }

    clone() {
        return new Polar2(...this);
    }

    copy(polar: Polar2) {
        return this.set(polar.radius, polar.theta);
    }

    set(radius: number, theta: number) {
        return this.setRadius(radius).setTheta(theta);
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

    toCanonical() {
        if (this.radius === 0) {
            return this.setTheta(0);
        }

        if (this.radius < 0) {
            this.radius = -this.radius;
            this.theta += Math.PI;
        }

        if (this.theta > TWO_PI) {
            this.theta += Math.PI;
            this.theta = modRadians(this.theta);
            this.theta -= Math.PI;
        }

        return this;
    }

    *[Symbol.iterator]() {
        yield this.radius;
        yield this.theta;
    }
}

export default Polar2;
