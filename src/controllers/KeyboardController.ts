import Controller from './Controller';

import type { ControllerOptions, ControllerBindings } from '~/types';

class KeyboardController extends Controller<string, KeyboardEvent> {
	constructor(bindings: Partial<ControllerBindings<string, KeyboardEvent>>, options?: ControllerOptions) {
        super(bindings, options);

		const eventListenerOptions = { signal: this._abortController.signal };

		window.addEventListener('keydown', this._handleKeyDown.bind(this), eventListenerOptions);
		window.addEventListener('keyup', this._handleKeyUp.bind(this), eventListenerOptions);
	}

    protected _getEventCode(event: KeyboardEvent) {
        return event.code;
    }

	private _handleKeyDown(event: KeyboardEvent) {
        this._setEvent(event);
    }

	private _handleKeyUp(event: KeyboardEvent) {
        this._deleteEvent(event);
    }
}

export default KeyboardController;
