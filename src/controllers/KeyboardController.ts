import Controller from './Controller';

import type { ControllerOptions, ControllerBindings } from '~/types';

class KeyboardController extends Controller<string, KeyboardEvent, Window> {
	constructor(bindings: Partial<ControllerBindings<string, KeyboardEvent>>, options?: ControllerOptions) {
        super(window, bindings, options);

        this._addEventListeners();
	}

    protected _addEventListeners() {
        this.eventTarget.addEventListener('keydown', this._handleKeyDown.bind(this), this._eventListenerOptions);
		this.eventTarget.addEventListener('keyup', this._handleKeyUp.bind(this), this._eventListenerOptions);
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
