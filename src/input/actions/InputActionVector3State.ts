
import { Vector3 } from '~/math';

import { InputBinding, InputAxis3DBinding } from '../bindings';

import type { InputControlType } from '~/enums';
import type { InputManagerDeviceMap, InputActionState, InputControlMap } from '~/types';

class InputActionVector3State implements InputActionState<InputControlType.VECTOR_3> {
    #value: Vector3;
    #tempValue: Vector3;

    constructor() {
        this.#value = new Vector3();
        this.#tempValue = new Vector3();
    }

    get value() {
        return this.#value;
    }

    update(devices: InputManagerDeviceMap, bindings: Set<InputBinding | InputAxis3DBinding>) {
        const value = this.#value;
        const tempValue = this.#tempValue;

        value.reset();
        tempValue.reset()

        let valueLengthSquared = 0;

        bindings.forEach((binding) => {
            if (binding instanceof InputBinding) {
                this.#handleInputBinding(devices, binding);
            }
            else if (binding instanceof InputAxis3DBinding) {
                this.#handleInputAxis3DBinding(devices, binding);
            }

            const tempValueLengthSquared = tempValue.lengthSquared;

            if (tempValueLengthSquared > valueLengthSquared) {
                valueLengthSquared = tempValueLengthSquared;

                value.copy(tempValue);
            }
        });

        if (value.lengthSquared > 1) {
            value.normalize();
        }
    }

    // TBD
    #handleInputBinding(devices: InputManagerDeviceMap, binding: InputBinding) {}

    #handleInputAxis3DBinding(devices: InputManagerDeviceMap, binding: InputAxis3DBinding) {
        const bindingControls = binding.controls;

        const leftSignal = this.#getSignal(devices, bindingControls.left);
        const rightSignal = this.#getSignal(devices, bindingControls.right);
        const upSignal = this.#getSignal(devices, bindingControls.up);
        const downSignal = this.#getSignal(devices, bindingControls.down);
        const forwardSignal = this.#getSignal(devices, bindingControls.forward);
        const backwardSignal = this.#getSignal(devices, bindingControls.backward);

        this.#tempValue.set(
            rightSignal - leftSignal,
            upSignal - downSignal,
            forwardSignal - backwardSignal
        );
    }

    #getSignal(devices: InputManagerDeviceMap, controls: InputControlMap) {
        let signal = 0;

        controls.forEach((control) => {
            const device = devices.get(control.deviceType);

            if (device) {
                const controlHasEvent = device.hasEvent(control.key);

                // TODO: This needs to be changed, because signal will always be discrete.
                // Hence, it won't work properly for devices, such as: gamepad, gyroscope, etc.
                if (controlHasEvent) {
                    signal = 1;
                }
            }
        });

        return signal;
    }
}

export default InputActionVector3State;
