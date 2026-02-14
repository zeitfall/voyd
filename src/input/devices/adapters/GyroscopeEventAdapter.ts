import type { Vector } from '~/math';
import type { InputDeviceType } from '~/enums';
import type { InputDeviceEventAdapter } from '~/types';

class GyroscopeEventAdapter implements InputDeviceEventAdapter<InputDeviceType.GYROSCOPE> {

    // TBD
    getDiscrete(event: GamepadEvent) {
        return 0;
    }

    // TBD
    getContinuous(event: GamepadEvent) {
        return 0;
    }

    // TBD
    getDelta<V extends Vector>(event: GamepadEvent, outValue: V) {
        return outValue.reset();
    }

    // TBD
    getPosition<V extends Vector>(event: GamepadEvent, outValue: V) {
        return outValue.reset();
    }
}

const gyroscopeEventAdapterInstance = new GyroscopeEventAdapter();

export default gyroscopeEventAdapterInstance;
