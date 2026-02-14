import InputActionDiscreteState from './InputActionDiscreteState';
import InputActionContinuousState from './InputActionContinuousState';
import InputActionAxisState from './InputActionAxisState';
import InputActionVector2State from './InputActionVector2State';
import InputActionVector3State from './InputActionVector3State';

import { InputControlType } from '~/enums';

import type { InputActionStateDictionary } from '~/types';

class InputActionStateFactory {

    static create<C extends InputControlType>(controlType: C) {
        switch (controlType) {
            case InputControlType.DISCRETE:
                return new InputActionDiscreteState() as InputActionStateDictionary[C];

            case InputControlType.CONTINUOUS:
                return new InputActionContinuousState() as InputActionStateDictionary[C];

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
