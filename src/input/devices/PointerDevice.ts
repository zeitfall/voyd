import { InputDeviceType, MouseButton } from '~/enums';

import type { InputDevice, PointerButton } from '~/types';

class PointerDevice implements InputDevice {
    #targetElement: HTMLElement;
    #connectionAbortController: AbortController | null;
    #pointerAbortController: AbortController | null;

    #events: Map<PointerButton, PointerEvent>;
    #pointerSlots: Map<number, number>;

    constructor(targetElement: HTMLElement) {
        this.#targetElement = targetElement;
        this.#connectionAbortController = null;
        this.#pointerAbortController = null;

        this.#events = new Map();
        this.#pointerSlots = new Map();
    }

    get type() {
        return InputDeviceType.POINTER;
    }

    get events(): ReadonlyMap<PointerButton, PointerEvent> {
        return this.#events;
    }

    connect() {
        this.disconnect();

        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#connectionAbortController = abortController;
        
        this.#targetElement.addEventListener('click', () => this.#requestPointerLock(), eventListenerOptions);
        document.addEventListener('pointerlockchange', () => this.#handlePointerLockChange(), eventListenerOptions);
    }

    disconnect() {
        const connectionAbortController = this.#connectionAbortController;

        if (connectionAbortController) {
            connectionAbortController.abort();

            this.#connectionAbortController = null;
        }

        this.#destroyPointerEventListeners();
        this.#exitPointerLock();
    }

    getEvent(key: PointerButton) {
        return this.#events.get(key);
    }

    hasEvent(key: PointerButton) {
        return this.#events.has(key);
    }

    #handlePointerDown(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            button: pointerButton
        } = event;

        let pointerKey;

        switch (pointerType) {
            case 'mouse':
                pointerKey = this.#getMouseButtonKeyForPress(pointerButton);

                break;

            case 'touch':
                pointerKey = this.#assignTouchKey(pointerId);

                break;

            // case 'pen':
            //     break;

            default:
                this.#throwUnsupportedPointerError(pointerType);
        }

        if (typeof pointerKey !== 'undefined') {
            this.#events.set(pointerKey, event);
        }
    }

    #handlePointerMove(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            buttons: pointerButtons
        } = event;

        const events = this.#events;

        switch (pointerType) {
            case 'mouse':
                const mouseKey = this.#getMouseButtonKeyForMove(pointerButtons);

                if (events.has(mouseKey)) {
                    events.set(mouseKey, event);
                }

                break;

            case 'touch':
                const touchKey = this.#getTouchKey(pointerId);

                if (touchKey && events.has(touchKey)) {
                    events.set(touchKey, event);
                }

                break;

            // case 'pen':
            //     break;

            default:
                this.#throwUnsupportedPointerError(pointerType);
        }
    }

    #handlePointerUp(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            button: pointerButton
        } = event;

        let pointerKey;

        switch (pointerType) {
            case 'mouse':
                pointerKey = this.#getMouseButtonKeyForPress(pointerButton);

                break;

            case 'touch':
                pointerKey = this.#getTouchKey(pointerId);

                break;

            // case 'pen':
            //     break;

            default:
                this.#throwUnsupportedPointerError(pointerType);
        }

        if (typeof pointerKey !== 'undefined') {
            this.#events.delete(pointerKey);
            this.#pointerSlots.delete(pointerId);
        }
    }

    #getMouseButtonKeyForPress(pointerButton: number) {
        switch (pointerButton) {
            case 0:
                return MouseButton.LMB;

            case 1:
                return MouseButton.MMB;

            case 2:
                return MouseButton.RMB;

            case 3:
                return MouseButton.BACKWARD;

            case 4:
                return MouseButton.FORWARD;

            default:
                return MouseButton.NONE;
        }
    }

    #getMouseButtonKeyForMove(pointerButtons: number) {
        if (pointerButtons & 1) {
            return MouseButton.LMB;
        }

        if (pointerButtons & 2) {
            return MouseButton.RMB;
        }

        if (pointerButtons & 4) {
            return MouseButton.MMB;
        }

        if (pointerButtons & 8) {
            return MouseButton.BACKWARD;
        }

        if (pointerButtons & 16) {
            return MouseButton.FORWARD;
        }

        return MouseButton.NONE;
    }

    #formatTouchKey(slotIndex: number) {
        return `Touch${slotIndex}` as const;
    }

    #assignTouchKey(pointerId: number) {
        const pointerSlots = this.#pointerSlots;
        const pointerSlotValues = pointerSlots.values();
        const uniquePointerSlots = new Set(pointerSlotValues);

        let freePointerSlot = 0;

        while (uniquePointerSlots.has(freePointerSlot)) {
            freePointerSlot++;
        }

        pointerSlots.set(pointerId, freePointerSlot);

        return this.#formatTouchKey(freePointerSlot);
    }

    #getTouchKey(pointerId: number) {
        const pointerSlot = this.#pointerSlots.get(pointerId);

        if (typeof pointerSlot === 'undefined') {
            return;
        }

        return this.#formatTouchKey(pointerSlot);
    }

    #throwUnsupportedPointerError(pointerType: string) {
        throw new Error(`[PointerDevice]: Cannot handle pointer. Unsupported pointer type "${pointerType}" was given.`);
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

    #exitPointerLock() {
        if (document.pointerLockElement === this.#targetElement) {
            document.exitPointerLock();
        }
    }

    #handlePointerLockChange() {
        this.#destroyPointerEventListeners();

        if (document.pointerLockElement === this.#targetElement) {
            const abortController = new AbortController();
            const eventListenerOptions = { signal: abortController.signal, passive: true };

            this.#pointerAbortController = abortController;

            this.#initPointerEventListeners(eventListenerOptions);
        }
    }

    #initPointerEventListeners(options: AddEventListenerOptions) {
        window.addEventListener('pointerdown', (event) => this.#handlePointerDown(event), options);
        window.addEventListener('pointerenter', (event) => this.#handlePointerDown(event), options);
        window.addEventListener('pointermove', (event) => this.#handlePointerMove(event), options);
        
        window.addEventListener('pointerup', (event) => this.#handlePointerUp(event), options);
        window.addEventListener('pointerleave', (event) => this.#handlePointerUp(event), options);
        window.addEventListener('pointercancel', (event) => this.#handlePointerUp(event), options);
    }

    #destroyPointerEventListeners() {
        const pointerAbortController = this.#pointerAbortController;

        if (pointerAbortController) {
            pointerAbortController.abort();

            this.#pointerAbortController = null;
        }

        this.#events.clear();
        this.#pointerSlots.clear();
    }
}

export default PointerDevice;