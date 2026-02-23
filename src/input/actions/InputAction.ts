import { createInputActionState } from '~/utils';

import { InputControlType } from '~/enums';

import type InputActionState from './InputActionState';
import type { InputDeviceMap, InputBindingMap, InputProcessorMap } from '~/types';

class InputAction<C extends InputControlType> {
	#name: string;
	#controlType: C;
	#state: InputActionState<C>;
	#bindings: Set<InputBindingMap[C]>;
	#processors: Set<InputProcessorMap[C]>;

	constructor(name: string, controlType: C) {
		this.#name = name;
		this.#controlType = controlType;
		// @ts-expect-error Type 'InputActionStateMap[C]' is not assignable to type 'InputActionState<C>'.
		this.#state = createInputActionState(controlType);
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

	get bindings() {
		return this.#bindings;
	}

	get processors() {
		return this.#processors;
	}

	update(devices: InputDeviceMap) {
		this.#state.update(devices, this.#bindings, this.#processors);
	}
}

export default InputAction;
