import Controller from './Controller';

import { PointerButton } from '~/enums';

import type { ControllerOptions, ControllerBindings } from '~/types';

type PointerButtonKeys = keyof typeof PointerButton;

class PointerController extends Controller<PointerButtonKeys, PointerEvent> {
    constructor(
        targetElement: HTMLElement,
        bindings: Partial<ControllerBindings<PointerButtonKeys, PointerEvent>>,
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
        return PointerButton[event.button] as PointerButtonKeys;
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