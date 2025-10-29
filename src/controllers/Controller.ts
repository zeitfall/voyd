import { defineReadOnlyProperties } from '~/utils';

import type { ControllerCallback, ControllerBindings } from '~/types';

abstract class Controller<E extends Event> {
    declare protected readonly _events: Map<string, E>;
    declare protected readonly _listeners: Map<string, ControllerCallback<E>>;
	declare protected readonly _abortController: AbortController;

    constructor(bindings: ControllerBindings<E>) {
        const _events = new Map();
        const _listeners = new Map();
        const _abortController = new AbortController();

        Object.entries(bindings).forEach((binding) => {
            const [eventCode, callback] = binding;

            _listeners.set(eventCode, callback);
        });

        defineReadOnlyProperties(this, {
            // @ts-expect-error Object literal may only specify known properties, and '_events' does not exist in type 'Record<keyof this, unknown>'.
            _events,
            _listeners,
            _abortController,
        });
    }

    update() {
        this._events.forEach((event, eventCode) => {
            const listener = this._listeners.get(eventCode);

            if (typeof listener === 'function') {
                listener(event);
            }
        });
    }

	dispose() {
		this._abortController.abort();
	}
}

export default Controller;
