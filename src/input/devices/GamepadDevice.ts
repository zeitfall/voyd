import { InputDeviceType } from '~/enums';

import type { InputDevice } from '~/types';

class GamepadDevice implements InputDevice {

    constructor() {
        throw new Error('[GamepadDevice]: Not implemented.');
    }

    get type() {
        return InputDeviceType.GAMEPAD;
    }

    connect() {}

    disconnect() {}
}

export default GamepadDevice;
