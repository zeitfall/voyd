import { Vector2, Vector3, type Vector } from '~/math';

import type { InputDeviceType } from '~/enums';
import type { InputDeviceEventAdapter } from '~/types';

class PointerEventAdapter implements InputDeviceEventAdapter<InputDeviceType.POINTER> {

    getDiscrete(event: PointerEvent | WheelEvent) {
        return Math.sign(event.buttons);
    }

    getContinuous(event: PointerEvent | WheelEvent) {
        if (event instanceof WheelEvent) {
            return 0;
        }

        return event.pressure;
    }

    getDelta<V extends Vector>(event: PointerEvent | WheelEvent, outValue: V) {
        let deltaX = 0;
        let deltaY = 0;

        if (event instanceof PointerEvent) {
            deltaX = event.movementX;
            deltaY = event.movementY;
        }
        else if (event instanceof WheelEvent) {
            deltaX = -event.deltaY;
            deltaY = -event.deltaX;
        }

        if (outValue instanceof Vector2) {
            outValue.set(deltaX, deltaY);
        }
        else if (outValue instanceof Vector3) {
            outValue.set(deltaX, 0, deltaY);
        }

        return outValue;
    }

    getPosition<V extends Vector>(event: PointerEvent | WheelEvent, outValue: V) {
        const { clientX, clientY } = event;

        if (outValue instanceof Vector2) {
            outValue.set(clientX, clientY);
        }
        else if (outValue instanceof Vector3) {
            outValue.set(clientX, 0, clientY);
        }

        return outValue;
    }
}

const pointerEventAdapterInstance = new PointerEventAdapter();

export default pointerEventAdapterInstance;
