import type { Vector } from '~/math';
import type { InputDeviceType } from '~/enums';
import type { InputDeviceEventAdapter } from '~/types';

class KeyboardEventAdapter implements InputDeviceEventAdapter<InputDeviceType.KEYBOARD> {

    getDiscrete(event: KeyboardEvent) {
        return 1;
    }

    getContinuous(event: KeyboardEvent) {
        return 1;
    }

    getDelta<V extends Vector>(event: KeyboardEvent, outValue: V) {
        return outValue.reset();
    }

    getPosition<V extends Vector>(event: KeyboardEvent, outValue: V) {
        return outValue.reset();
    }
}

const keyboardEventAdapterInstance = new KeyboardEventAdapter();

export default keyboardEventAdapterInstance;
