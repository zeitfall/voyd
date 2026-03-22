import PointerEventAdapter from './PointerEventAdapter';
import TouchPanGesture from './TouchPanGesture';
import TouchPinchGesture from './TouchPinchGesture';

import { InputDeviceType, MouseButton } from '~/enums';

import type { InputDevice, PointerKey, PointerGesture } from '~/types';

class PointerDevice implements InputDevice<InputDeviceType.POINTER> {
    #targetElement: HTMLElement;
    #abortController: AbortController | null;

    #events: Map<PointerKey, PointerEvent | WheelEvent>;
    #gestures: Set<PointerGesture>;
    #pointerSlots: Map<number, number>;

    constructor(targetElement: HTMLElement) {
        this.#targetElement = targetElement;
        this.#abortController = null;

        const gestures = [
            new TouchPanGesture(1),
            new TouchPanGesture(2),
            new TouchPanGesture(3),
            new TouchPinchGesture()
        ];

        this.#events = new Map();
        this.#gestures = new Set(gestures);
        this.#pointerSlots = new Map();
    }

    get type() {
        return InputDeviceType.POINTER as const;
    }

    get eventAdapter() {
        return PointerEventAdapter;
    }

    get pointerLocked() {
        return document.pointerLockElement === this.#targetElement;
    }

    connect() {
        this.disconnect();

        const targetElement = this.#targetElement;
        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#abortController = abortController;

        document.addEventListener('pointerlockchange', () => this.#handlePointerLockChange(), eventListenerOptions);
        
        targetElement.addEventListener('click', () => this.#requestPointerLock(), eventListenerOptions);

        targetElement.addEventListener('wheel', (event) => this.#handleWheel(event), eventListenerOptions);

        targetElement.addEventListener('pointerdown', (event) => this.#handlePointerDown(event), eventListenerOptions);
        targetElement.addEventListener('pointerenter', (event) => this.#handlePointerDown(event), eventListenerOptions);
        targetElement.addEventListener('pointermove', (event) => this.#handlePointerMove(event), eventListenerOptions);
        
        targetElement.addEventListener('pointerup', (event) => this.#handlePointerUp(event), eventListenerOptions);
        targetElement.addEventListener('pointerleave', (event) => this.#handlePointerUp(event), eventListenerOptions);
        targetElement.addEventListener('pointercancel', (event) => this.#handlePointerUp(event), eventListenerOptions);
    }

    disconnect() {
        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();

            this.#abortController = null;
        }

        this.#clearPointerMaps();
        this.#exitPointerLock();
    }

    flush() {
        this.#events.delete('MouseWheel');
    }

    getEvent(key: PointerKey) {
        return this.#events.get(key);
    }

    hasEvent(key: PointerKey) {
        return this.#events.has(key);
    }

    async #requestPointerLock() {
        const targetElement = this.#targetElement;

		try {
            if (this.pointerLocked || typeof targetElement.requestPointerLock !== 'function') {
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
        if (this.pointerLocked) {
            document.exitPointerLock();
        }
    }

    #handlePointerLockChange() {
        if (this.pointerLocked) {
            return;
        }

        this.#clearPointerMaps();
    }

    #clearPointerMaps() {
        this.#events.clear();
        this.#pointerSlots.clear();
    }

    #handleWheel(event: WheelEvent) {
        this.#events.set('MouseWheel', event);
    }

    #handlePointerDown(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            button: pointerButton
        } = event;

        if (!this.#shouldProcessPointer(pointerType)) {
            return;
        }

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

        this.#evaluateGestures();
    }

    #handlePointerMove(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            buttons: pointerButtons
        } = event;

        if (!this.#shouldProcessPointer(pointerType)) {
            return;
        }

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

        this.#evaluateGestures();
    }

    #handlePointerUp(event: PointerEvent) {
        const {
            pointerId,
            pointerType,
            button: pointerButton
        } = event;

        if (!this.#shouldProcessPointer(pointerType)) {
            return;
        }

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

        this.#evaluateGestures();
    }

    #evaluateGestures() {
        const events = this.#events;

        this.#gestures.forEach((gesture) => {
            const gestureType = gesture.type;
            const gestureEvent = gesture.evaluate(events, this.#pointerSlots.size);

            if (gestureEvent) {
                events.set(gestureType, gestureEvent);
            }
            else {
                events.delete(gestureType);
            }
        });
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

    #assignTouchKey(pointerId: number) {
        const pointerSlots = this.#pointerSlots;

        if (pointerSlots.has(pointerId)) {
            return this.#getTouchKey(pointerId);
        }

        const uniquePointerSlots = new Set(pointerSlots.values());

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

    #formatTouchKey(slotIndex: number) {
        return `Touch${slotIndex}` as const;
    }

    #shouldProcessPointer(pointerType: string) {
        if (pointerType === 'mouse') {
            return this.pointerLocked;
        }

        return true;
    }

    #throwUnsupportedPointerError(pointerType: string) {
        throw new Error(`[PointerDevice]: Cannot handle pointer. Unsupported pointer type "${pointerType}" was given.`);
    }
}

export default PointerDevice;