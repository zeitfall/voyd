import { Vector2, Vector3 } from '~/math';

import { InputControlType } from '~/enums';

import type { InputActionValueDictionary } from '~/types';

class InputActionValueFactory {

    static create<C extends InputControlType>(controlType: C) {
        switch (controlType) {
            case InputControlType.DISCRETE:
            case InputControlType.CONTINUOUS:
            case InputControlType.AXIS:
                return 0 as InputActionValueDictionary[C];

            case InputControlType.VECTOR_2:
                return new Vector2() as InputActionValueDictionary[C];

            case InputControlType.VECTOR_3:
                return new Vector3() as InputActionValueDictionary[C];

            default:
                throw new Error(`[InputActionValueFactory]: Unsupported control type. Control with type "${controlType}" was given.`);
        }
    }
}

export default InputActionValueFactory;
