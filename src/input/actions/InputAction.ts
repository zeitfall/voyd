import InputActionStateFactory from './InputActionStateFactory';

import { InputControlType } from '~/enums';

import type {
	InputManagerDeviceMap,
	InputActionState,
	InputBindingDictionary
} from '~/types';

class InputAction<
	C extends InputControlType = InputControlType.DISCRETE,
	B extends InputBindingDictionary[C] = InputBindingDictionary[C]	
> {
	#name: string;
	#controlType: C;
	#state: InputActionState<C>;
	#bindings: Set<B>;

	constructor(name: string, controlType: C) {
		this.#name = name;
		this.#controlType = controlType;
		// @ts-expect-error Type 'InputActionStateDictionary[C]' is not assignable to type 'InputActionState<C>'.
		this.#state = InputActionStateFactory.createState(controlType);
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

	update(devices: InputManagerDeviceMap) {
		this.#state.update(devices, this.#bindings);
	}
}

export default InputAction;
