import { defineReadOnlyProperties } from "~/utils";

import type { Camera } from "~/cameras";

abstract class Controls {
	declare private readonly _abortController: AbortController;

    declare protected readonly _eventListenerOptions: AddEventListenerOptions;

	declare readonly camera: Camera;

    constructor(camera: Camera) {
        const _abortController = new AbortController();

        const _eventListenerOptions = Object.seal({
			signal: _abortController.signal,
			passive: true,
		});

        defineReadOnlyProperties(this, {
            // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'keyof this'.
            _abortController,
            _eventListenerOptions,
            camera
        });
    }

    dispose() {
        this._abortController.abort();
    }

    abstract update(): void;
}

export default Controls;
