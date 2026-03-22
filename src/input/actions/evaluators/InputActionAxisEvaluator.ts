import { Vector2 } from '~/math';
import { InputSingleBinding, InputAxis1DBinding } from '../../bindings';

import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator, InputControlMap } from '~/types';

// PLEASE, FORGIVE ME
const _tempVector = new Vector2();

class InputActionAxisEvaluator implements InputActionEvaluator<InputControlType.AXIS> {

    evaluate(devices: InputDeviceMap, binding: InputSingleBinding | InputAxis1DBinding) {

        if (binding instanceof InputSingleBinding) {
            return this.#handleInputSingleBinding(devices, binding);
        }

        if (binding instanceof InputAxis1DBinding) {
            return this.#handleInputAxis1DBinding(devices, binding);
        }

        return 0;
    }

    resolve(oldValue: number, newValue: number) {
        return Math.abs(newValue) > Math.abs(oldValue) ? newValue : oldValue;
    }

    reset() {
        return 0;
    }

    #handleInputSingleBinding(devices: InputDeviceMap, binding: InputSingleBinding) {
        const { control } = binding;

        const device = devices.get(control.deviceType);
        const deviceEvent = device && device.getEvent(control.key);

        if (deviceEvent) {
            return device.eventAdapter.getDelta(deviceEvent, _tempVector).x;
        }

        return 0;
    }

    #handleInputAxis1DBinding(devices: InputDeviceMap, binding: InputAxis1DBinding) {
        const bindingControls = binding.controls;

        const negativeSignal = this.#getSignal(devices, bindingControls.negative);
        const positiveSignal = this.#getSignal(devices, bindingControls.positive);

        return positiveSignal - negativeSignal;
    }

    #getSignal(devices: InputDeviceMap, controls: InputControlMap) {
        let signal = 0;

        controls.forEach((control) => {
            const device = devices.get(control.deviceType);
            const deviceEvent = device && device.getEvent(control.key);

            if (deviceEvent) {
                const newSignal = device.eventAdapter.getContinuous(deviceEvent);

                signal = Math.max(signal, newSignal);
            }
        });

        return signal;
    }
}

export default InputActionAxisEvaluator;
