import ControlBehavior from './ControlBehavior';

import { Vector2, Vector3, Spherical } from '~/math';

import { clamp } from '~/utils';

import { PI_OVER_TWO, EPSILON_4, EPSILON_12 } from '~/constants';

import type { ControlsPipelineContext } from '~/types';

class LookBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #currentMovement: Vector2;
    #targetMovement: Vector2;
    #direction: Vector3;
    #deltaDirection: Vector3;
    #sphericalDirection: Spherical;

    minPitchAngle: number;
    maxPitchAngle: number;
    minYawAngle: number;
    maxYawAngle: number;

    dampingFactor: number;
    sensitivity: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#currentMovement = new Vector2();
        this.#targetMovement = new Vector2();
        this.#direction = new Vector3();
        this.#deltaDirection = new Vector3();
        this.#sphericalDirection = new Spherical();

        this.minYawAngle = Number.NEGATIVE_INFINITY;
        this.maxYawAngle = Number.POSITIVE_INFINITY;
        this.minPitchAngle = -PI_OVER_TWO + EPSILON_4;
        this.maxPitchAngle = PI_OVER_TWO - EPSILON_4;;

        this.dampingFactor = 12;
        this.sensitivity = .005;
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

    setDampingFactor(damping: number) {
        this.dampingFactor = damping;

        return this;
    }

    setSensitivity(sensitivity: number) {
        this.sensitivity = sensitivity;

        return this;
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

    update(deltaTime: number) {
        const currentMovement = this.#currentMovement;
        const targetMovement = this.#targetMovement;

        const hasInertia = currentMovement.lengthSquared > EPSILON_12;
        const hasMoved = targetMovement.lengthSquared > EPSILON_12;

        if (this.context && (hasInertia || hasMoved)) {
            const { camera, deltaTarget } = this.context;

            const direction = this.#direction;
            const deltaDirection = this.#deltaDirection;
            const sphericalDirection = this.#sphericalDirection;

            const lerpFraction = 1 - Math.exp(-this.dampingFactor * deltaTime);

            currentMovement.lerp(targetMovement, lerpFraction);
            direction.copy(camera.target).directionFrom(camera.position);

            sphericalDirection.setFromVector(direction);
            sphericalDirection.theta = clamp(sphericalDirection.theta - currentMovement.x, this.minYawAngle, this.maxYawAngle);
            sphericalDirection.phi = clamp(sphericalDirection.phi - currentMovement.y, this.minPitchAngle, this.maxPitchAngle);

            deltaDirection.setFromSpherical(sphericalDirection).subtract(direction);

            deltaTarget.add(deltaDirection);
        }
        else {
            currentMovement.reset();
        }

        targetMovement.reset();

        return this;
    }

    #handlePointerMove(event: PointerEvent) {
        if (this.context && this.context.enabled) {
            const { movementX, movementY } = event;

            this.#targetMovement.x += this.sensitivity * movementX;
            this.#targetMovement.y += this.sensitivity * movementY;
        }
    }
}

export default LookBehavior;
