import { InputActionValueFactory, InputActionEvaluatorFactory } from './evaluators';

import { InputControlType } from '~/enums';

import type {
    InputDeviceMap,
    InputActionValueMap,
    InputActionEvaluator,
    InputActionEvaluatorMap,
    InputBindingMap
} from '~/types';

class InputActionState<C extends InputControlType> {
    #value: InputActionValueMap[C];
    #tempValue: InputActionValueMap[C];
    #evaluator: InputActionEvaluatorMap[C];

    constructor(controlType: C) {
        this.#value = InputActionValueFactory.create(controlType);
        this.#tempValue = InputActionValueFactory.create(controlType);
        this.#evaluator = InputActionEvaluatorFactory.create(controlType);
    }

    get value() {
        return this.#value;
    }

    update(devices: InputDeviceMap, bindings: Set<InputBindingMap[C]>) {
        const evaluator = this.#evaluator as unknown as InputActionEvaluator<C>;

        this.#value = evaluator.reset(this.#value);

        bindings.forEach((binding) => {
            const newValue = evaluator.evaluate(devices, binding, this.#tempValue);

            this.#value = evaluator.resolve(this.#value, newValue);
        });
    }
}

export default InputActionState;
