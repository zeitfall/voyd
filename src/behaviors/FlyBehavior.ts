import TransformBehavior from './TransformBehavior';

import { Vector2, Vector3 } from '~/math';

import type { TransformController } from '~/controllers';

class FlyBehavior extends TransformBehavior {
    #abortController: AbortController | null;
    #eventTarget: HTMLElement;
    #pointerIds: Set<number>;

    #inputMovement: Vector3;
    #desiredPosition: Vector3;

    constructor(eventTarget: HTMLElement) {
        super();

        this.#abortController = null;
        this.#eventTarget = eventTarget;
        this.#pointerIds = new Set();

        this.#inputMovement = new Vector3();
        this.#desiredPosition = new Vector3();
    }

    get #pointerCount() {
        return this.#pointerIds.size;
    }

    override attachTo(controller: TransformController) {
        super.attachTo(controller);

        this.#desiredPosition.copy(controller.context.targetPosition);
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

        const { targetPosition, targetRotation } = controller.context;

        const inputMovement = this.#inputMovement;
        const desiredPosition = this.#desiredPosition;

        if (inputMovement.lengthSquared > 0) {
            inputMovement
                .scaleX(-1)
                .multiplyByQuaternion(targetRotation)
                .setLength(8 * deltaTime)
                .setY(0);

            desiredPosition.add(inputMovement);

            inputMovement.reset();
        }

        targetPosition.damp(desiredPosition, 8, deltaTime);
    }

    #initEventListeners() {
        let abortController = this.#abortController;

        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();

        const eventListenerOptions = { signal: abortController.signal };

        const eventTarget = this.#eventTarget;

        eventTarget.addEventListener('pointerdown', (event) => this.#handlePointerDown(event), eventListenerOptions);
        eventTarget.addEventListener('pointerup', (event) => this.#handlePointerUp(event), eventListenerOptions);
        eventTarget.addEventListener('pointercancel', (event) => this.#handlePointerUp(event), eventListenerOptions);
        eventTarget.addEventListener('pointerout', (event) => this.#handlePointerUp(event), eventListenerOptions);
        eventTarget.addEventListener('pointerleave', (event) => this.#handlePointerUp(event), eventListenerOptions);
        eventTarget.addEventListener('pointermove', (event) => this.#handlePointerMove(event), eventListenerOptions);
    }

    #handlePointerDown(event: PointerEvent) {
        this.#pointerIds.add(event.pointerId);
    }

    #handlePointerUp(event: PointerEvent) {
        this.#pointerIds.delete(event.pointerId);
    }

    #handlePointerMove(event: PointerEvent) {
        if (this.#pointerCount === 1) {
            const inputMovement = this.#inputMovement;

            inputMovement.x += event.movementX;
            inputMovement.z += event.movementY;
        }
    }
}

export default FlyBehavior;
