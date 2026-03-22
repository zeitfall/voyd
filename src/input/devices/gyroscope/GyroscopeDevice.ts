import GyroscopeEventAdapter from './GyroscopeEventAdapter';

import { InputDeviceType } from '~/enums';

import type { InputDevice } from '~/types';

class GyroscopeDevice implements InputDevice<InputDeviceType.GYROSCOPE> {

    constructor() {
        throw new Error('[GyroscopeDevice]: Not implemented.');
    }

    get type() {
        return InputDeviceType.GYROSCOPE as const;
    }

    get eventAdapter() {
        return GyroscopeEventAdapter;
    }

    connect() {}

    disconnect() {}

    flush() {}

    getEvent(key: unknown) {}

    hasEvent(key: unknown) {}
}

export default GyroscopeDevice;
