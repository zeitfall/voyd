import TransformBehavior from './TransformBehavior';

import { Vector2, Vector3, Spherical, Quaternion } from '~/math';

import { PI_OVER_TWO } from '~/constants';

import { clamp, damp } from '~/utils';

import type { TransformController } from '~/controllers';


class LookBehavior extends TransformBehavior {
    #abortController: AbortController | null;
    #eventTarget: HTMLElement;

    #inputMovement: Vector2;
    #yawQuaternion: Quaternion;
    #pitchQuaternion: Quaternion;

    #currentYawAngle: number;
    #targetYawAngle: number;
    minYawAngle: number;
    maxYawAngle: number;

    #currentPitchAngle: number;
    #targetPitchAngle: number;
    minPitchAngle: number;
    maxPitchAngle: number;

    lookSensitivity: number;
    lookSharpness: number;

    constructor(eventTarget: HTMLElement) {
        super();

        this.#abortController = null;
        this.#eventTarget = eventTarget;

        this.#inputMovement = new Vector2();
        this.#yawQuaternion = new Quaternion();
        this.#pitchQuaternion = new Quaternion();

        this.#currentYawAngle = 0;
        this.#targetYawAngle = 0;
        this.minYawAngle = Number.NEGATIVE_INFINITY;
        this.maxYawAngle = Number.POSITIVE_INFINITY;

        this.#currentPitchAngle = 0;
        this.#targetPitchAngle = 0;
        this.minPitchAngle = -PI_OVER_TWO + Number.EPSILON;
        this.maxPitchAngle = PI_OVER_TWO - Number.EPSILON;

        this.lookSensitivity = 8;
        this.lookSharpness = 16;
    }

    get yawAngle() {
        return this.#targetYawAngle;
    }

    set yawAngle(value: number) {
        this.#targetYawAngle = clamp(value, this.minYawAngle, this.maxYawAngle);
    }

    get pitchAngle() {
        return this.#targetPitchAngle;
    }

    set pitchAngle(value: number) {
        this.#targetPitchAngle = clamp(value, this.minPitchAngle, this.maxPitchAngle);
    }

    setYawAngle(angle: number) {
        this.yawAngle = angle;

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

    setPitchAngle(angle: number) {
        this.pitchAngle = angle;

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

    setLookSensitivity(sensitivity: number) {
        this.lookSensitivity = sensitivity;

        return this;
    }
    
    setLookSharpness(sharpness: number) {
        this.lookSharpness = sharpness;

        return this;
    }

    override attachTo(controller: TransformController) {
        super.attachTo(controller);

        const controllerNode = controller.node;

        if (controllerNode) {
            const controllerTransform = controllerNode.transform;

            const nodeForward = new Vector3();
            const nodeSphericalForward = new Spherical();

            controllerTransform.extractForward(nodeForward);
            nodeSphericalForward.setFromVector(nodeForward);

            this.#targetYawAngle = this.#currentYawAngle = nodeSphericalForward.theta;
            this.#targetPitchAngle = this.#currentPitchAngle = nodeSphericalForward.phi;
        }

        this.#initEventListeners();

        return this;
    }

    override detach() {
        super.detach();

        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();

            this.#abortController = null;
        }
    }

    update(deltaTime: number) {
        const controller = this.controller;

        if (!controller) {
            return;
        }

        const { targetRotation } = controller.context;

        const inputMovement = this.#inputMovement;
        const yawQuaternion = this.#yawQuaternion;
        const pitchQuaternion = this.#pitchQuaternion;

        if (inputMovement.lengthSquared > 0) {
            inputMovement.setLength(this.lookSensitivity * deltaTime);

            this.yawAngle += inputMovement.x;
            this.pitchAngle -= inputMovement.y;

            inputMovement.reset();
        }

        let currentYawAngle = this.#currentYawAngle;
        let currentPitchAngle = this.#currentPitchAngle;

        currentYawAngle = damp(currentYawAngle, this.#targetYawAngle, this.lookSharpness, deltaTime);
        currentPitchAngle = damp(currentPitchAngle, this.#targetPitchAngle, this.lookSharpness, deltaTime);

        yawQuaternion.setFromAxisAngle(Vector3.UP, currentYawAngle);
        pitchQuaternion.setFromAxisAngle(Vector3.RIGHT, -currentPitchAngle);

        this.#currentYawAngle = currentYawAngle;
        this.#currentPitchAngle = currentPitchAngle;

        targetRotation
            .copy(this.#yawQuaternion)
            .multiply(this.#pitchQuaternion)
            .normalize();
    }

    #initEventListeners() {
        let abortController = this.#abortController;

        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();

        const eventListenerOptions = { signal: abortController.signal };

        this.#eventTarget.addEventListener('pointermove', (event) => this.#handlePointerMove(event), eventListenerOptions);
    }

    #handlePointerMove(event: PointerEvent) {
        if (event.buttons === 2) {
            const inputMovement = this.#inputMovement;

            inputMovement.x += event.movementX;
            inputMovement.y += event.movementY;
        }
    }
}

export default LookBehavior;
