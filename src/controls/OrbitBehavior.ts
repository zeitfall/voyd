import ControlBehavior from './ControlBehavior';

import { Vector2, Vector3, Spherical } from '~/math';

import { clamp } from '~/utils';

import { PI_OVER_TWO, EPSILON_8, EPSILON_12 } from '~/constants';

import type { ControlsPipelineContext } from '~/types';

class OrbitBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #currentMovement: Vector2;
    #targetMovement: Vector2;
    #offset: Vector3;
    #sphericalOffset: Spherical;
    #positionOffset: Vector3;

    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    dampingFactor: number;
    sensitivity: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#currentMovement = new Vector2();
        this.#targetMovement = new Vector2();
        this.#offset = new Vector3();
        this.#sphericalOffset = new Spherical();
        this.#positionOffset = new Vector3();

        this.minAzimuthAngle = Number.NEGATIVE_INFINITY;
        this.maxAzimuthAngle = Number.POSITIVE_INFINITY;
        this.minPolarAngle = -PI_OVER_TWO + EPSILON_8;
        this.maxPolarAngle = PI_OVER_TWO - EPSILON_8;

        this.dampingFactor = 8;
        this.sensitivity = .01;
    }

    setMinAzimuthAngle(angle: number) {
		this.minAzimuthAngle = angle;

		return this;
	}

	setMaxAzimuthAngle(angle: number) {
		this.maxAzimuthAngle = angle;

		return this;
	}

	setMinPolarAngle(angle: number) {
		this.minPolarAngle = angle;

		return this;
	}

	setMaxPolarAngle(angle: number) {
		this.maxPolarAngle = angle;

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
            const { camera, deltaPosition } = this.context;

            const offset = this.#offset;
            const sphericalOffset = this.#sphericalOffset;
            const positionOffset = this.#positionOffset;

            const lerpFraction = 1 - Math.exp(-this.dampingFactor * deltaTime);

            currentMovement.lerp(targetMovement, lerpFraction);
            offset.copy(camera.position).directionFrom(camera.target);

            sphericalOffset.setFromVector(offset);
            sphericalOffset.theta = clamp(sphericalOffset.theta - currentMovement.x, this.minAzimuthAngle, this.maxAzimuthAngle);
            sphericalOffset.phi = clamp(sphericalOffset.phi - currentMovement.y, this.minPolarAngle, this.maxPolarAngle);

            positionOffset.setFromSpherical(sphericalOffset).subtract(offset);

            deltaPosition.add(positionOffset);
        } else {
            currentMovement.reset();
        }

        targetMovement.reset();

        return this;
    }

    #handlePointerMove(event: PointerEvent) {
        const { buttons, pressure, movementX, movementY } = event;

        if (this.context && this.context.enabled && buttons + pressure > 0) {
            this.#targetMovement.x += this.sensitivity * movementX;
            this.#targetMovement.y -= this.sensitivity * movementY;
        }
    }
}

export default OrbitBehavior;
