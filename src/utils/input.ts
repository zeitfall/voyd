import { Vector2, Vector3 } from '~/math';

import {
	InputActionDiscreteEvaluator,
	InputActionContinuousEvaluator,
	InputActionAxisEvaluator,
	InputActionVector2Evaluator,
	InputActionVector3Evaluator,
	InputActionDiscreteState,
	InputActionContinuousState,
	InputActionAxisState,
	InputActionVector2State,
	InputActionVector3State
} from '~/input';

import { InputControlType } from '~/enums';

import type {
	InputActionValueMap,
	InputActionStateMap,
	InputActionEvaluatorMap
} from '~/types';

function createInputActionValue<C extends InputControlType>(controlType: C) {
	switch (controlType) {
		case InputControlType.DISCRETE:
		case InputControlType.CONTINUOUS:
		case InputControlType.AXIS:
			return 0 as InputActionValueMap[C];

		case InputControlType.VECTOR_2:
			return new Vector2() as InputActionValueMap[C];

		case InputControlType.VECTOR_3:
			return new Vector3() as InputActionValueMap[C];

		default:
			throw new Error(`Unsupported control type, "${controlType}" was given.`);
	}
}

function createInputActionEvaluator<C extends InputControlType>(controlType: C) {
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
			return new InputActionVector3Evaluator() as InputActionEvaluatorMap[C];

		default:
			throw new Error(`Unsupported control type, "${controlType}" was given.`);
	}
}

function createInputActionState<C extends InputControlType>(controlType: C) {
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
			throw new Error(`Unsupported control type, "${controlType}" was given.`);
	}
}

export {
	createInputActionValue,
	createInputActionEvaluator,
	createInputActionState,
};
