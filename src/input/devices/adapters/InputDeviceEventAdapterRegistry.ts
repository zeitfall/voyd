import KeyboardEventAdapter from './KeyboardEventAdapter';
import PointerEventAdapter from './PointerEventAdapter';
import GamepadEventAdapter from './GamepadEventAdapter';
import GyroscopeEventAdapter from './GyroscopeEventAdapter';

import { InputDeviceType } from '~/enums';

import type { InputDeviceEventAdapter } from '~/types';

class InputDeviceEventAdapterRegistry {
    #adapters: Map<InputDeviceType, InputDeviceEventAdapter>;

    constructor() {
        const adapters = new Map();

        adapters.set(InputDeviceType.KEYBOARD, KeyboardEventAdapter);
        adapters.set(InputDeviceType.POINTER, PointerEventAdapter);
        adapters.set(InputDeviceType.GAMEPAD, GamepadEventAdapter);
        adapters.set(InputDeviceType.GYROSCOPE, GyroscopeEventAdapter);

        this.#adapters = adapters;
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
