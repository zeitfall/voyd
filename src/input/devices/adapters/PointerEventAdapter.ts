import { Vector2, Vector3, type Vector } from '~/math';

import type { InputDeviceType } from '~/enums';
import type { InputDeviceEventAdapter } from '~/types';

class PointerEventAdapter implements InputDeviceEventAdapter<InputDeviceType.POINTER> {

    getDiscrete(event: PointerEvent) {
        return Math.sign(event.buttons);
    }

    getContinuous(event: PointerEvent) {
        return event.pressure;
    }

    getDelta<V extends Vector>(event: PointerEvent, outValue: V) {
        const { movementX, movementY } = event;

        if (outValue instanceof Vector2) {
            outValue.set(movementX, movementY);
        }
        else if (outValue instanceof Vector3) {
            outValue.set(movementX, movementY, 0);
        }

        return outValue;
    }

    getPosition<V extends Vector>(event: PointerEvent, outValue: V) {
        const { clientX, clientY } = event;

        if (outValue instanceof Vector2) {
            outValue.set(clientX, clientY);
        }
        else if (outValue instanceof Vector3) {
            outValue.set(clientX, clientY, 0);
        }

        return outValue;
    }
}

const pointerEventAdapterInstance = new PointerEventAdapter();

export default pointerEventAdapterInstance;
