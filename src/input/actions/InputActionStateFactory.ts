import InputActionDiscreteState from './InputActionDiscreteState';
import InputActionContinuousState from './InputActionContinuousState';
import InputActionAxisState from './InputActionAxisState';
import InputActionVector2State from './InputActionVector2State';
import InputActionVector3State from './InputActionVector3State';

import { InputControlType } from '~/enums';

import type { InputActionStateMap } from '~/types';

class InputActionStateFactory {

    static create<C extends InputControlType>(controlType: C) {
        switch (controlType) {
            case InputControlType.DISCRETE:
                return new InputActionDiscreteState() as InputActionStateMap[C];

            case InputControlType.CONTINUOUS:
                return new InputActionContinuousState() as InputActionStateMap[C];

            case InputControlType.AXIS:
                return new InputActionAxisState() as InputActionStateMap[C];

            case InputControlType.VECTOR_2:
                return new InputActionVector2State() as InputActionStateMap[C];

            case InputControlType.VECTOR_3:
                return new InputActionVector3State() as InputActionStateMap[C];

            default:
                throw new Error(`[InputActionStateFactory]: Cannot create action state. Unsupported control type "${controlType}" was given.`);
        }
    }
}

export default InputActionStateFactory;
