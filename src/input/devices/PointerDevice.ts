import { InputDeviceType, MouseButton } from '~/enums';

import type { InputDevice, PointerButton } from '~/types';

class PointerDevice implements InputDevice {
    #abortController: AbortController | null;
    #events: Map<PointerButton, PointerEvent>;
    #pointerSlots: Map<number, number>;

    constructor() {
        this.#abortController = null;
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
        const eventListenerOptions = { signal: abortController.signal, passive: true };

        this.#abortController = abortController;

        window.addEventListener('pointerdown', (event) => this.#handlePointerDown(event), eventListenerOptions);
        window.addEventListener('pointerenter', (event) => this.#handlePointerDown(event), eventListenerOptions);
        window.addEventListener('pointermove', (event) => this.#handlePointerMove(event), eventListenerOptions);
        
        window.addEventListener('pointerup', (event) => this.#handlePointerUp(event), eventListenerOptions);
        window.addEventListener('pointerleave', (event) => this.#handlePointerUp(event), eventListenerOptions);
        window.addEventListener('pointercancel', (event) => this.#handlePointerUp(event), eventListenerOptions);
    }

    disconnect() {
        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();

            this.#abortController = null;
        }

        this.#events.clear();
        this.#pointerSlots.clear();
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
                pointerKey = this.#getMouseKey(pointerButton);

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
            button: pointerButton
        } = event;

        const events = this.#events;

        switch (pointerType) {
            case 'mouse':
                const mouseKey = this.#getMouseKey(pointerButton);

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
                pointerKey = this.#getMouseKey(pointerButton);

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

    #getMouseKey(pointerButton: number) {
        switch (pointerButton) {
            case 0:
                return MouseButton.LMB;

            case 1:
                return MouseButton.MMB;

            case 2:
                return MouseButton.RMB;

            case 3:
                return MouseButton.BACK;

            case 4:
                return MouseButton.FORWARD;

            default:
                return MouseButton.NONE;
        }
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
}

export default PointerDevice;