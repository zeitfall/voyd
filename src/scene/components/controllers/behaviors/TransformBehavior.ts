import type TransformController from '../TransformController';
import type { TransformControllerBinding } from '~/enums';

abstract class TransformBehavior {
    #controller: TransformController | null;

    constructor() {
        this.#controller = null;
    }

    get controller() {
        return this.#controller;
    }

    attachTo(binding: TransformControllerBinding, controller: TransformController) {
        const currentController = this.#controller;

        if (currentController && currentController !== controller) {
            currentController.removeBehavior(this);
        }

        this.#controller = controller;

        controller.addBehavior(binding, this);

        return this;
    }

    detach() {
        const controller = this.#controller;

        if (controller) {
            this.#controller = null;

            controller.removeBehavior(this);
        }
    }

    abstract update(deltaTime: number, active: boolean): boolean;
}

export default TransformBehavior;
