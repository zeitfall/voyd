import { defineReadOnlyProperties } from '~/utils';

import type { ControllerOptions, ControllerCallback, ControllerBindings } from '~/types';

abstract class Controller<K extends string, E extends Event, T = HTMLElement> {
    declare protected readonly _events: Map<K, E>;
    declare protected readonly _listeners: Map<K, ControllerCallback<E>>;

	declare protected _abortController: AbortController;
    declare protected readonly _eventListenerOptions: AddEventListenerOptions;

    declare readonly eventTarget: T;
    declare readonly bindings: ControllerBindings<K, E>;
    declare readonly options: ControllerOptions;

    constructor(
        eventTarget: T,
        bindings: Partial<ControllerBindings<K, E>>,
        options: ControllerOptions = { mode: 'immediate' }
    ) {
        const _events = new Map();
        const _listeners = new Map();

        const _abortController = new AbortController();
        const _eventListenerOptions = Object.seal({ signal: _abortController.signal });

        const _bindings = Object.freeze(bindings);
        const _options = Object.seal(options);

        Object.entries(bindings).forEach((binding) => {
            const [eventCode, callback] = binding;

            _listeners.set(eventCode, callback);
        });

        this._abortController = _abortController;

        defineReadOnlyProperties(this, {
            // @ts-expect-error Object literal may only specify known properties, and '_events' does not exist in type 'Record<keyof this, unknown>'.
            _events,
            _listeners,
            _eventListenerOptions,
            eventTarget,
            bindings: _bindings,
            options: _options,
        });
    }

    protected abstract _addEventListeners(): void;

    protected abstract _getEventCode(event: E): K;

    protected _setEvent(event: E) {
        const eventCode = this._getEventCode(event);

        if (this._events.has(eventCode)) {
            // event.preventDefault();

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

    dispatch() {
        if (this.options.mode === 'sync') {
            this._events.forEach((event, eventCode) => {
                const listener = this._listeners.get(eventCode);

                if (typeof listener === 'function') {
                    listener(event);
                }
            });
        }
    }

    stop() {
        this._abortController.abort();
    }

    resume() {
        this._abortController = new AbortController();
        this._eventListenerOptions.signal = this._abortController.signal;

        this._addEventListeners();
    }

    clear() {
        this._events.clear();
        this._listeners.clear();
    }

	dispose() {
		this.stop();
        this.clear();
	}
}

export default Controller;
