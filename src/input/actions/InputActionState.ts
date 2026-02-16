import { InputActionValueFactory, InputActionEvaluatorFactory } from './evaluators';

import { InputControlType } from '~/enums';

import type {
    InputDeviceMap,
    InputActionValueMap,
    InputActionEvaluator,
    InputActionEvaluatorMap,
    InputBindingMap,
    InputProcessorMap,
    InputProcessor
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

            newValue = this.#processValue(newValue, binding.processors) as InputActionValueMap[C];

            this.#value = evaluator.resolve(this.#value, newValue);
        });

        // @ts-expect-error Argument of type 'ReadonlySet<InputProcessorMap[C]>' is not assignable to parameter of type 'ReadonlySet<InputProcessor<InputActionValueMap[C]>>'.
        this.#value = this.#processValue(this.#value, processors);
    }

    #processValue<V>(initialValue: V, processors: ReadonlySet<InputProcessor<V>>) {
        let value = initialValue;

        processors.forEach((processor) => {
            value = processor.process(value);
        });

        return value;
    }
}

export default InputActionState;
