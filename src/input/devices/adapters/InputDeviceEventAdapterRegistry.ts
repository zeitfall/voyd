import KeyboardEventAdapter from './KeyboardEventAdapter';
import PointerEventAdapter from './PointerEventAdapter';
import GamepadEventAdapter from './GamepadEventAdapter';
import GyroscopeEventAdapter from './GyroscopeEventAdapter';

import { InputDeviceType } from '~/enums';

import type { InputDeviceEventAdapter } from '~/types';

class InputDeviceEventAdapterRegistry {
    #adapters: Map<InputDeviceType, InputDeviceEventAdapter>;

    constructor() {
        this.#adapters = new Map();

        this.register(InputDeviceType.KEYBOARD, KeyboardEventAdapter)
            .register(InputDeviceType.POINTER, PointerEventAdapter)
            .register(InputDeviceType.GAMEPAD, GamepadEventAdapter)
            .register(InputDeviceType.GYROSCOPE, GyroscopeEventAdapter);
    }

    register(deviceType: InputDeviceType, adapter: InputDeviceEventAdapter) {
        const adapters = this.#adapters;

        if (adapters.has(deviceType)) {
            throw new Error(`[InputDeviceEventAdapterRegistry]: Event adapter for device type "${deviceType}" has already been registered.`);
        }

        adapters.set(deviceType, adapter);

        return this;
    }

    unregister(deviceType: InputDeviceType) {
        const adapters = this.#adapters;

        const adapter = adapters.get(deviceType);

        if (!adapter) {
            throw new Error(`[InputDeviceEventAdapterRegistry]: Cannot unregister. Event adapter for device type "${deviceType}" was not found.`);
        }

        adapters.delete(deviceType);
    }

    get(deviceType: InputDeviceType) {
        return this.#adapters.get(deviceType);
    }

    has(deviceType: InputDeviceType) {
        return this.#adapters.has(deviceType);
    }
}

const inputDeviceEventAdapterRegistryInstance = new InputDeviceEventAdapterRegistry();

export default inputDeviceEventAdapterRegistryInstance;
