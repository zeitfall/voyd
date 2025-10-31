import type Vector from './Vector';

abstract class Polar {
    static clone(polar: Polar) {
        return polar.clone();
    }

    constructor(public radius = 1, public theta = 0) {}

    setRadius(radius: number) {
        this.radius = radius;

        return this;
    }

    setTheta(theta: number) {
        this.theta = theta;

        return this;
    }

    abstract clone(): Polar;
    
    abstract copy(polar: Polar): this;

    abstract set(...components: number[]): this;

    abstract setFromCartesian(...components: number[]): this;

    abstract setFromVector(vector: Vector): this;

    abstract toCanonical(): this;
}

export default Polar;
