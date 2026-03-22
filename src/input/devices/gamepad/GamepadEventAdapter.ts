import type { Vector } from '~/math';
import type { InputDeviceType } from '~/enums';
import type { InputDeviceEventAdapter } from '~/types';

class GamepadEventAdapter implements InputDeviceEventAdapter<InputDeviceType.GAMEPAD> {

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

const gamepadEventAdapterInstance = new GamepadEventAdapter();

export default gamepadEventAdapterInstance;
