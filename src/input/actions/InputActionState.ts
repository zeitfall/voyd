import { InputActionValueFactory, InputActionEvaluatorFactory } from './evaluators';

import { InputControlType } from '~/enums';

import type {
    InputDeviceMap,
    InputActionValueDictionary,
    InputActionEvaluator,
    InputActionEvaluatorDictionary,
    InputBindingDictionary
} from '~/types';

class InputActionState<C extends InputControlType> {
    #value: InputActionValueDictionary[C];
    #tempValue: InputActionValueDictionary[C];
    #evaluator: InputActionEvaluatorDictionary[C];

    constructor(controlType: C) {
        this.#value = InputActionValueFactory.create(controlType);
        this.#tempValue = InputActionValueFactory.create(controlType);
        this.#evaluator = InputActionEvaluatorFactory.create(controlType);
    }

    get value() {
        return this.#value;
    }

    update(devices: InputDeviceMap, bindings: Set<InputBindingDictionary[C]>) {
        const evaluator = this.#evaluator as unknown as InputActionEvaluator<C>;

        this.#value = evaluator.reset(this.#value);

        bindings.forEach((binding) => {
            const newValue = evaluator.evaluate(devices, binding, this.#tempValue);

            this.#value = evaluator.resolve(this.#value, newValue);
        });
    }
}

export default InputActionState;
