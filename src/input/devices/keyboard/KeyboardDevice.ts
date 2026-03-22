import KeyboardEventAdapter from './KeyboardEventAdapter';

import { InputDeviceType } from '~/enums';

import type { InputDevice } from '~/types';

class KeyboardDevice implements InputDevice<InputDeviceType.KEYBOARD> {
    #abortController: AbortController | null;
    #events: Map<string, KeyboardEvent>;

    constructor() {
        this.#abortController = null;
        this.#events = new Map();
    }

    get type() {
        return InputDeviceType.KEYBOARD as const;
    }

    get eventAdapter() {
        return KeyboardEventAdapter;
    }

    connect() {
        this.disconnect();

        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#abortController = abortController;

        window.addEventListener('keydown', (event) => this.#handleKeyDown(event), eventListenerOptions);
        window.addEventListener('keyup', (event) => this.#handleKeyUp(event), eventListenerOptions);
    }

    disconnect() {
        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();

            this.#abortController = null;
        }

        this.#events.clear();
    }

    flush() {}

    getEvent(key: string) {
        return this.#events.get(key);
    }

    hasEvent(key: string) {
        return this.#events.has(key);
    }

    #handleKeyDown(event: KeyboardEvent) {
        this.#events.set(event.code, event);
    }

    #handleKeyUp(event: KeyboardEvent) {
        this.#events.delete(event.code);
    }
}

export default KeyboardDevice;
