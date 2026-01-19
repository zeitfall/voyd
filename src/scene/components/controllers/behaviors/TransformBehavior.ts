import type TransformController from '../TransformController';

abstract class TransformBehavior {
    #controller: TransformController | null;

    constructor() {
        this.#controller = null;
    }

    get controller() {
        return this.#controller;
    }

    attachTo(controller: TransformController) {
        const currentController = this.#controller;

        if (currentController && currentController !== controller) {
            currentController.removeBehavior(this);
        }

        this.#controller = controller;

        controller.addBehavior(this);

        return this;
    }

    detach() {
        const controller = this.#controller;

        if (controller) {
            this.#controller = null;

            controller.removeBehavior(this);
        }
    }

    abstract update(deltaTime: number): void;
}

export default TransformBehavior;
