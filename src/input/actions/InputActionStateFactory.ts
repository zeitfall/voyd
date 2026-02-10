import InputActionAxisState from './InputActionAxisState';
import InputActionVector2State from './InputActionVector2State';
import InputActionVector3State from './InputActionVector3State';

import { InputControlType } from '~/enums';

import type { InputActionStateDictionary } from '~/types';

class InputActionStateFactory {

    static createState<C extends InputControlType>(controlType: C) {
        switch (controlType) {
            case InputControlType.AXIS:
                return new InputActionAxisState() as InputActionStateDictionary[C];

            case InputControlType.VECTOR_2:
                return new InputActionVector2State() as InputActionStateDictionary[C];

            case InputControlType.VECTOR_3:
                return new InputActionVector3State() as InputActionStateDictionary[C];

            default:
                throw new Error(`[InputActionStateFactory]: Cannot create action state. Unsupported control type "${controlType}" was given.`);
        }
    }
}

export default InputActionStateFactory;
