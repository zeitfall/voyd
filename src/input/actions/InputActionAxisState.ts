import type { InputControlType } from '~/enums';
import type { InputActionState, InputManagerDeviceMap } from '~/types';
import { InputAxis1DBinding, InputBinding } from '../bindings';

class InputActionAxisState implements InputActionState<InputControlType.AXIS> {
    #value: number;

    constructor() {
        this.#value = 0;
    }

    get value() {
        return this.#value;
    }

    update(devices: InputManagerDeviceMap, bindings: Set<InputBinding | InputAxis1DBinding>): void {
        this.#value = 0;

        bindings.forEach((binding) => {
            let tempValue = 0;

            if (binding instanceof InputBinding) {
                tempValue = this.#handleInputBinding(devices, binding);
            }
            else if (binding instanceof InputAxis1DBinding) {
                tempValue = this.#handleInputAxis1DBinding(devices, binding);
            }

            if (tempValue > this.#value) {
                this.#value = tempValue;
            }
        });
    }

    // TBD
    #handleInputBinding(devices: InputManagerDeviceMap, binding: InputBinding) {
        return 0;
    }

    #handleInputAxis1DBinding(devices: InputManagerDeviceMap, binding: InputAxis1DBinding) {
        return 0;
    }
}

export default InputActionAxisState;
