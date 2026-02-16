import { Vector3 } from '~/math';
import { InputDeviceEventAdapterRegistry } from '../../devices';
import { InputSingleBinding, InputAxis3DBinding } from '../../bindings';

import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator, InputControlMap } from '~/types';

class InputActionVector3Evaluator implements InputActionEvaluator<InputControlType.VECTOR_3> {

    // NOTE: I kinda dislike the 'tempValue' parameter approach, but let it be.
    evaluate(devices: InputDeviceMap, binding: InputSingleBinding | InputAxis3DBinding, tempValue: Vector3) {
        tempValue.reset();

        if (binding instanceof InputSingleBinding) {
            this.#handleInputSingleBinding(devices, binding, tempValue);
        }
        else if (binding instanceof InputAxis3DBinding) {
            this.#handleInputAxis3DBinding(devices, binding, tempValue);
        }

        return tempValue;
    }

    resolve(oldValue: Vector3, newValue: Vector3) {
        if (oldValue.lengthSquared < newValue.lengthSquared) {
            oldValue.copy(newValue);
        }

        return oldValue;
    }

    reset(value: Vector3) {
        return value.reset();
    }

    #handleInputSingleBinding(devices: InputDeviceMap, binding: InputSingleBinding, tempValue: Vector3) {
        const control = binding.control;
        const controlDeviceType = control.deviceType;
        const controlKey = control.key;

        const device = devices.get(controlDeviceType);
        const deviceEvent = device && device.getEvent(controlKey);
        const deviceEventAdapter = InputDeviceEventAdapterRegistry.get(controlDeviceType);

        if (device && deviceEvent && deviceEventAdapter) {
            deviceEventAdapter.getDelta(deviceEvent, tempValue);
        }

        return tempValue;
    }

    #handleInputAxis3DBinding(devices: InputDeviceMap, binding: InputAxis3DBinding, tempValue: Vector3) {
        const bindingControls = binding.controls;

        const leftSignal = this.#getSignal(devices, bindingControls.left);
        const rightSignal = this.#getSignal(devices, bindingControls.right);
        const upSignal = this.#getSignal(devices, bindingControls.up);
        const downSignal = this.#getSignal(devices, bindingControls.down);
        const forwardSignal = this.#getSignal(devices, bindingControls.forward);
        const backwardSignal = this.#getSignal(devices, bindingControls.backward);

        tempValue.set(
            rightSignal - leftSignal,
            upSignal - downSignal,
            forwardSignal - backwardSignal
        );
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

export default InputActionVector3Evaluator;
