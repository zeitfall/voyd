import { InputDeviceEventAdapterRegistry } from '../../devices';
import { InputSingleBinding, InputAxis1DBinding } from '../../bindings';

import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator, InputControlMap } from '~/types';

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
        return Math.max(oldValue, newValue);
    }

    reset() {
        return 0;
    }

    #handleInputSingleBinding(devices: InputDeviceMap, binding: InputSingleBinding) {
        // // TBD
        // const control = binding.control;
        // const controlDeviceType = control.deviceType;
        // const controlKey = control.key;

        // const device = devices.get(controlDeviceType);
        // const deviceEvent = device && device.getEvent(controlKey);
        // const deviceEventAdapter = InputDeviceEventAdapterRegistry.get(controlDeviceType);

        // if (device && deviceEvent && deviceEventAdapter) {
        //     const value = deviceEventAdapter.getDelta(deviceEvent, new Vector2());

        //     return value.projectOnVector(Vector2.RIGHT).length;
        // }

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
            const controlDeviceType = control.deviceType;
            const controlKey = control.key;

            const device = devices.get(control.deviceType);
            const deviceEvent = device && device.getEvent(controlKey);
            const deviceEventAdapter = InputDeviceEventAdapterRegistry.get(controlDeviceType);

            if (device && deviceEvent && deviceEventAdapter) {
                const newSignal = deviceEventAdapter.getContinuous(deviceEvent);

                signal = Math.max(signal, newSignal);
            }
        });

        return signal;
    }
}

export default InputActionAxisEvaluator;
