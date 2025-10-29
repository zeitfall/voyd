import Controller from './Controller';

import type { ControllerBindings } from '~/types';

class PointerController extends Controller<PointerEvent> {
    constructor(bindings: ControllerBindings<PointerEvent>) {
        super(bindings);

		const eventListenerOptions = { signal: this._abortController.signal };

        window.addEventListener('pointerdown', () => void 0, eventListenerOptions);
        window.addEventListener('pointerup', () => void 0, eventListenerOptions);
        window.addEventListener('pointermove', () => void 0, eventListenerOptions);
    }
}

export default PointerController;