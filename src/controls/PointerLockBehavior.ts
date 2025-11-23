import ControlBehavior from './ControlBehavior';

import type { ControlsPipelineContext } from '~/types';

class PointerLockBehavior extends ControlBehavior {
    #abortController: AbortController | null;
    #targetElement: HTMLElement;

    constructor(targetElement: HTMLElement) {
        super();

        this.#abortController = null;
        this.#targetElement = targetElement;
    }

    override attach(context: ControlsPipelineContext) {
        super.attach(context);

        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#abortController = abortController;

        this.#targetElement.addEventListener('click', this.#requestPointerLock.bind(this), eventListenerOptions);
        document.addEventListener('pointerlockchange', this.#handlePointerLockChange.bind(this), eventListenerOptions);
        
        this.#handlePointerLockChange();

        return this;
    }

    override detach() {
        super.detach();

        const abortController = this.#abortController;
        const targetElement = this.#targetElement;

        if (document.pointerLockElement === targetElement) {
            document.exitPointerLock();
        }

        if (abortController) {
            abortController.abort();
        }

        return this;
    }

    update() {
        return this;
    }

    async #requestPointerLock() {
        const targetElement = this.#targetElement;

		try {
            if (document.pointerLockElement === targetElement) {
                return;
            }

			await targetElement.requestPointerLock({ unadjustedMovement: true });
		} catch (error) {
			// @ts-expect-error 'error' is of type 'unknown'.
			if (error.name === 'NotSupportedError') {
				await targetElement.requestPointerLock();

				return;
			}

			throw error;
		}
	}

    #handlePointerLockChange() {
        if (this.context) {
            this.context.enabled = document.pointerLockElement === this.#targetElement;
        }
    }
}

export default PointerLockBehavior;
