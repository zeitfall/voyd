import { InputDeviceType } from '~/enums';
import type { InputDevice } from '~/types';

class GyroscopeDevice implements InputDevice {

    constructor() {
        throw new Error('[GyroscopeDevice]: Not implemented.');
    }

    get type() {
        return InputDeviceType.GYROSCOPE;
    }

    connect() {}

    disconnect() {}
}

export default GyroscopeDevice;
