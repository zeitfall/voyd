import Controller from './Controller';

import { PointerButton } from '~/enums';

import type { ControllerOptions, ControllerBindings } from '~/types';

type PointerButtonNames = keyof typeof PointerButton;

class PointerController extends Controller<PointerButtonNames, PointerEvent> {
	constructor(
		eventTarget: HTMLElement,
		bindings: Partial<ControllerBindings<PointerButtonNames, PointerEvent>>,
		options?: ControllerOptions,
	) {
		super(eventTarget, bindings, options);

		this._addEventListeners();
	}

	protected override _addEventListeners() {
		this.eventTarget.addEventListener('pointerdown', this._handlePointerDown.bind(this), this._eventListenerOptions);
		this.eventTarget.addEventListener('pointerenter', this._handlePointerOver.bind(this), this._eventListenerOptions);
		this.eventTarget.addEventListener('pointerup', this._handlePointerUp.bind(this), this._eventListenerOptions);
		this.eventTarget.addEventListener('pointerleave', this._handlePointerOut.bind(this), this._eventListenerOptions);
	}

	protected _getEventCode(event: PointerEvent) {
		return PointerButton[event.button] as PointerButtonNames;
	}

	protected _handlePointerDown(event: PointerEvent) {
		this._setEvent(event);
	}

	protected _handlePointerUp(event: PointerEvent) {
		this._deleteEvent(event);
	}

	protected _handlePointerOver(event: PointerEvent) {
		if (event.buttons + event.pressure > 0) {
			// @ts-expect-error Argument of type '{ button: PointerControllerButton; }' is not assignable to parameter of type 'PointerEvent'.
			this._setEvent({ button: PointerControllerButton.LMB });
		}
	}

	protected _handlePointerOut() {
		// @ts-expect-error Argument of type '{ button: PointerControllerButton; }' is not assignable to parameter of type 'PointerEvent'.
		this._deleteEvent({ button: PointerControllerButton.LMB });
	}
}

export default PointerController;
