import { defineReadOnlyProperties } from '~/utils';

import type { ControllerOptions, ControllerCallback, ControllerBindings } from '~/types';

abstract class Controller<K extends string, E extends Event> {
    declare protected readonly _events: Map<K, E>;
    declare protected readonly _listeners: Map<K, ControllerCallback<E>>;
	declare protected readonly _abortController: AbortController;

    declare readonly options: ControllerOptions;

    constructor(bindings: Partial<ControllerBindings<K, E>>, options: ControllerOptions = { mode: 'immediate' }) {
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
            options,
        });
    }

    protected abstract _getEventCode(event: E): K;

    protected _setEvent(event: E) {
        const eventCode = this._getEventCode(event);

        if (this._events.has(eventCode)) {
            event.preventDefault();

            return;
        }

        this._events.set(eventCode, event);

        if (this.options.mode === 'immediate') {
            const listener = this._listeners.get(eventCode);

            listener?.(event);
        }
    }

    protected _deleteEvent(event: E) {
        const eventCode = this._getEventCode(event);

        if (this._events.has(eventCode)) {
            this._events.delete(eventCode);
        }
    }

    update() {
        if (this.options.mode === 'sync') {
            this._events.forEach((event, eventCode) => {
                const listener = this._listeners.get(eventCode);

                if (typeof listener === 'function') {
                    listener(event);
                }
            });
        }
    }

	dispose() {
        this._events.clear();
        this._listeners.clear();
		this._abortController.abort();
	}
}

export default Controller;
