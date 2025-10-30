import Controller from './Controller';

import { PointerControllerButton } from '~/enums';

import type { ControllerOptions, ControllerBindings, PointerControllerButtonKeys } from '~/types';

class PointerController extends Controller<PointerControllerButtonKeys, PointerEvent> {
    constructor(
        targetElement: HTMLElement,
        bindings: Partial<ControllerBindings<PointerControllerButtonKeys, PointerEvent>>,
        options?: ControllerOptions
    ) {
        super(bindings, options);

		const eventListenerOptions = { signal: this._abortController.signal };

        targetElement.addEventListener('pointerdown', this._handlePointerDown.bind(this), eventListenerOptions);
        targetElement.addEventListener('pointerenter', this._handlePointerOver.bind(this), eventListenerOptions);
        targetElement.addEventListener('pointerup', this._handlePointerUp.bind(this), eventListenerOptions);
        targetElement.addEventListener('pointerleave', this._handlePointerOut.bind(this), eventListenerOptions);
    }

    protected _getEventCode(event: PointerEvent) {
        return PointerControllerButton[event.button] as PointerControllerButtonKeys;
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