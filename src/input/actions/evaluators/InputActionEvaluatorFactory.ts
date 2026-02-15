import InputActionDiscreteEvaluator from './InputActionDiscreteEvaluator';
import InputActionContinuousEvaluator from './InputActionContinuousEvaluator';
import InputActionAxisEvaluator from './InputActionAxisEvaluator';
import InputActionVector2Evaluator from './InputActionVector2Evaluator';
import InputActionVector3Evaluator from './InputActionVector3Evaluator';

import { InputControlType } from '~/enums';

import type { InputActionEvaluatorMap } from '~/types';

class InputActionEvaluatorFactory {

    static create<C extends InputControlType>(controlType: C) {
        switch (controlType) {
            case InputControlType.DISCRETE:
                return new InputActionDiscreteEvaluator() as InputActionEvaluatorMap[C];

            case InputControlType.CONTINUOUS:
                return new InputActionContinuousEvaluator() as InputActionEvaluatorMap[C];

            case InputControlType.AXIS:
                return new InputActionAxisEvaluator() as InputActionEvaluatorMap[C];

            case InputControlType.VECTOR_2:
                return new InputActionVector2Evaluator() as InputActionEvaluatorMap[C];

            case InputControlType.VECTOR_3:
                return new InputActionVector3Evaluator as InputActionEvaluatorMap[C];

            default:
                throw new Error(`[InputActionValueFactory]: Unsupported control type. Control with type "${controlType}" was given.`);
        }
    }
}

export default InputActionEvaluatorFactory;
