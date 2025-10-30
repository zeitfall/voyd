import Controller from './Controller';
import PointerController from './PointerController';

import { defineReadOnlyProperty } from '~/utils';

import type { ControllerOptions, ControllerBindings } from '~/types';

class KeyboardController extends Controller<string, KeyboardEvent> {
    declare private readonly _pointerController: PointerController;

	constructor(
        targetElement: HTMLElement,
        bindings: Partial<ControllerBindings<string, KeyboardEvent>>,
        options?: ControllerOptions
    ) {
        super(bindings, options);

        // NOTE: Idk if focusing makes sense here.
        // Probably, adding event listeners on window should be enough.
        targetElement.tabIndex = 0;

        const pointerController = new PointerController(targetElement, {
            LMB: () => targetElement.focus(),
            RMB: () => targetElement.blur()
        });

		const eventListenerOptions = { signal: this._abortController.signal };

		targetElement.addEventListener('keydown', this._handleKeyDown.bind(this), eventListenerOptions);
		targetElement.addEventListener('keyup', this._handleKeyUp.bind(this), eventListenerOptions);

        // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'keyof this'.
        defineReadOnlyProperty(this, '_pointerController', pointerController);
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

    override dispose() {
        super.dispose();

        this._pointerController.dispose();
    }
}

export default KeyboardController;
