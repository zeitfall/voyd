import InputActionStateFactory from './InputActionStateFactory';

import { InputControlType } from '~/enums';

import type InputActionState from './InputActionState';
import type { InputDeviceMap, InputBindingMap, InputProcessorMap } from '~/types';

class InputAction<
	C extends InputControlType,
	B extends InputBindingMap[C] = InputBindingMap[C],
	P extends InputProcessorMap[C] = InputProcessorMap[C]
> {
	#name: string;
	#controlType: C;
	#state: InputActionState<C>;
	#bindings: Set<B>;
	#processors: Set<P>;

	constructor(name: string, controlType: C) {
		this.#name = name;
		this.#controlType = controlType;
		// @ts-expect-error Type 'InputActionStateMap[C]' is not assignable to type 'InputActionState<C>'.
		this.#state = InputActionStateFactory.create(controlType);
		this.#bindings = new Set();
		this.#processors = new Set();
	}

	get name() {
		return this.#name;
	}

	get controlType() {
		return this.#controlType;
	}

	get value() {
		return this.#state.value;
	}

	get bindings(): ReadonlySet<B> {
		return this.#bindings;
	}

	addBinding(binding: B) {
		this.#bindings.add(binding);

		return this;
	}

	addProcessor(processor: P) {
		this.#processors.add(processor);
	
		return this;
	}

	update(devices: InputDeviceMap) {
		this.#state.update(devices, this.#bindings, this.#processors);
	}
}

export default InputAction;
