import InputActionStateFactory from './InputActionStateFactory';

import { InputControlType } from '~/enums';

import type {
	InputDeviceMap,
	InputActionStateDictionary,
	InputBindingDictionary
} from '~/types';

class InputAction<
	C extends InputControlType = InputControlType.DISCRETE,
	B extends InputBindingDictionary[C] = InputBindingDictionary[C]	
> {
	#name: string;
	#controlType: C;
	#state: InputActionStateDictionary[C];
	#bindings: Set<B>;

	constructor(name: string, controlType: C) {
		this.#name = name;
		this.#controlType = controlType;
		this.#state = InputActionStateFactory.create(controlType);
		this.#bindings = new Set();
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

	update(devices: InputDeviceMap) {
		// @ts-expect-error Argument of type 'Set<B>' is not assignable to parameter of type 'Set<InputBinding>'.
		this.#state.update(devices, this.#bindings);
	}
}

export default InputAction;
