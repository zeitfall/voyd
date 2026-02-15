import { InputActionValueFactory, InputActionEvaluatorFactory } from './evaluators';

import { InputControlType } from '~/enums';

import type {
    InputDeviceMap,
    InputActionValueMap,
    InputActionEvaluator,
    InputActionEvaluatorMap,
    InputBindingMap,
    InputProcessorMap
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

    update(
        devices: InputDeviceMap,
        bindings: ReadonlySet<InputBindingMap[C]>,
        processors: ReadonlySet<InputProcessorMap[C]>
    ) {
        const evaluator = this.#evaluator as unknown as InputActionEvaluator<C>;

        this.#value = evaluator.reset(this.#value);

        bindings.forEach((binding) => {
            let newValue = evaluator.evaluate(devices, binding, this.#tempValue);

            processors.forEach((processor) => {
                // @ts-expect-error Argument of type 'number | Vector2 | Vector3' is not assignable to parameter of type 'number & Vector & Vector2 & Vector3'.
                newValue = processor.process(newValue);
            });

            this.#value = evaluator.resolve(this.#value, newValue);
        });
    }
}

export default InputActionState;
