import ControlBehavior from './ControlBehavior';

import { Vector2, Vector3, Spherical } from '~/math';

import { clamp } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

import type { ControlsPipelineContext } from '~/types';

class LookBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #movement: Vector2;
    #direction: Vector3;
    #deltaDirection: Vector3;
    #sphericalDirection: Spherical;

    minPitchAngle: number;
    maxPitchAngle: number;
    minYawAngle: number;
    maxYawAngle: number;

    sensitivity: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#movement = new Vector2();
        this.#direction = new Vector3();
        this.#deltaDirection = new Vector3();
        this.#sphericalDirection = new Spherical();

        this.minYawAngle = Number.NEGATIVE_INFINITY;
        this.maxYawAngle = Number.POSITIVE_INFINITY;
        this.minPitchAngle = -PI_OVER_TWO + 1e-4;
        this.maxPitchAngle = PI_OVER_TWO - 1e-4;;

        this.sensitivity = .01;
    }

    #handlePointerMove(event: PointerEvent) {
        if (this.context && this.context.enabled) {
            const { movementX, movementY } = event;

            this.#movement.x += movementX;
            this.#movement.y += movementY;
        }
    }

    override attach(context: ControlsPipelineContext) {
        super.attach(context);

        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#abortController = abortController;

        window.addEventListener('pointermove', this.#handlePointerMove.bind(this), eventListenerOptions);

        return this;
    }

    override detach() {
        super.detach();

        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();
        }

        return this;
    }

    setMinYawAngle(angle: number) {
		this.minYawAngle = angle;

		return this;
	}

	setMaxYawAngle(angle: number) {
		this.maxYawAngle = angle;

		return this;
	}

	setMinPitchAngle(angle: number) {
		this.minPitchAngle = angle;

		return this;
	}

	setMaxPitchAngle(angle: number) {
		this.maxPitchAngle = angle;

		return this;
	}

    setSensitivity(sensitivity: number) {
        this.sensitivity = sensitivity;

        return this;
    }

    update() {
        const movement = this.#movement;

        if (this.context && movement.lengthSquared > 0) {
            const { camera, deltaTarget } = this.context;

            const direction = this.#direction;
            const deltaDirection = this.#deltaDirection;
            const sphericalDirection = this.#sphericalDirection;

            movement.multiplyByScalar(this.sensitivity);
            direction.copy(camera.target).directionFrom(camera.position);

            sphericalDirection.setFromVector(direction);
            sphericalDirection.theta = clamp(sphericalDirection.theta - movement.x, this.minYawAngle, this.maxYawAngle);
            sphericalDirection.phi = clamp(sphericalDirection.phi + movement.y, this.minPitchAngle, this.maxPitchAngle);

            deltaDirection.setFromSpherical(sphericalDirection).subtract(direction);

            deltaTarget.add(deltaDirection);
        }

        movement.set(0, 0);

        return this;
    }
}

export default LookBehavior;
