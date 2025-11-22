import ControlBehavior from './ControlBehavior';

import { Vector2, Vector3, Spherical } from '~/math';

import { clamp } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

import type { ControlsPipelineContext } from '~/types';

class OrbitBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #movement: Vector2;
    #offset: Vector3;
    #sphericalOffset: Spherical;
    #positionOffset: Vector3;

    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    sensitivity: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#movement = new Vector2();
        this.#offset = new Vector3();
        this.#sphericalOffset = new Spherical();
        this.#positionOffset = new Vector3();

        this.minAzimuthAngle = Number.NEGATIVE_INFINITY;
        this.maxAzimuthAngle = Number.POSITIVE_INFINITY;
        this.minPolarAngle = -PI_OVER_TWO + 1e-4;
        this.maxPolarAngle = PI_OVER_TWO - 1e-4;;

        this.sensitivity = .01;
    }

    #handlePointerMove(event: PointerEvent) {
        const { buttons, pressure, movementX, movementY } = event;

        if (this.context && this.context.enabled && buttons + pressure > 0) {
            this.#movement.x += movementX;
            this.#movement.y -= movementY;
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

    setSensitivity(sensitivity: number) {
        this.sensitivity = sensitivity;

        return this;
    }

    update() {
        const movement = this.#movement;

        if (this.context && movement.lengthSquared > 0) {
            const { camera, deltaPosition } = this.context;

            const offset = this.#offset;
            const sphericalOffset = this.#sphericalOffset;
            const positionOffset = this.#positionOffset;

            movement.multiplyByScalar(this.sensitivity);
            offset.copy(camera.position).directionFrom(camera.target);

            sphericalOffset.setFromVector(offset);
            sphericalOffset.theta = clamp(sphericalOffset.theta - movement.x, this.minAzimuthAngle, this.maxAzimuthAngle);
            sphericalOffset.phi = clamp(sphericalOffset.phi + movement.y, this.minPolarAngle, this.maxPolarAngle);

            positionOffset.setFromSpherical(sphericalOffset).subtract(offset);

            deltaPosition.add(positionOffset);
        }

        movement.set(0, 0);

        return this;
    }
}

export default OrbitBehavior;
