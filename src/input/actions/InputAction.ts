import InputActionStateFactory from './InputActionStateFactory';

import { InputControlType } from '~/enums';

import type InputActionState from './InputActionState';
import type { InputDeviceMap, InputBindingMap } from '~/types';

class InputAction<
	C extends InputControlType = InputControlType.DISCRETE,
	B extends InputBindingMap[C] = InputBindingMap[C]	
> {
	#name: string;
	#controlType: C;
	#state: InputActionState<C>;
	#bindings: Set<B>;

	constructor(name: string, controlType: C) {
		this.#name = name;
		this.#controlType = controlType;
		// @ts-expect-error Type 'InputActionStateMap[C]' is not assignable to type 'InputActionState<C>'.
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
		this.#state.update(devices, this.#bindings);
	}
}

export default InputAction;
