import GamepadEventAdapter from './GamepadEventAdapter';

import { InputDeviceType } from '../../enums';

import type { InputDevice } from '../../types';

class GamepadDevice implements InputDevice<InputDeviceType.GAMEPAD> {

    constructor() {
        throw new Error('[GamepadDevice]: Not implemented.');
    }

    get type() {
        return InputDeviceType.GAMEPAD as const;
    }

    get eventAdapter() {
        return GamepadEventAdapter;
    }

    connect() {}

    disconnect() {}

    flush() {}

    getEvent(key: unknown) {}

    hasEvent(key: unknown) {}
}

export default GamepadDevice;
