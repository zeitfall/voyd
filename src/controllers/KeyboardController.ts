import Controller from './Controller';

import type { ControllerBindings } from '~/types';

class KeyboardController extends Controller<KeyboardEvent> {
	constructor(bindings: ControllerBindings<KeyboardEvent>) {
        super(bindings);

		const eventListenerOptions = { signal: this._abortController.signal };

		window.addEventListener('keydown', this._onKeyDown.bind(this), eventListenerOptions);
		window.addEventListener('keyup', this._onKeyUp.bind(this), eventListenerOptions);
	}

	private _onKeyDown(event: KeyboardEvent) {
        const eventCode = event.code;

        if (this._events.has(eventCode)) {
            event.preventDefault();

            return;
        }

        this._events.set(eventCode, event);
    }

	private _onKeyUp(event: KeyboardEvent) {
        const eventCode = event.code;

        if (this._events.has(eventCode)) {
            this._events.delete(eventCode);
        }
    }
}

export default KeyboardController;
