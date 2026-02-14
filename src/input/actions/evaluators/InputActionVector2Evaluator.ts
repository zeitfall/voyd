import { Vector2 } from '~/math';
import { InputDeviceEventAdapterRegistry } from '../../devices';
import { InputBinding, InputAxis2DBinding } from '../../bindings';

import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator, InputControlMap } from '~/types';

class InputActionVector2Evaluator implements InputActionEvaluator<InputControlType.VECTOR_2> {

    // NOTE: I kinda dislike the 'tempValue' parameter approach, but let it be.
    evaluate(devices: InputDeviceMap, binding: InputBinding | InputAxis2DBinding, tempValue: Vector2) {
        tempValue.reset();

        if (binding instanceof InputBinding) {
            this.#handleInputBinding(devices, binding, tempValue);
        }
        else if (binding instanceof InputAxis2DBinding) {
            this.#handleInputAxis2DBinding(devices, binding, tempValue);
        }

        return tempValue;
    }

    resolve(oldValue: Vector2, newValue: Vector2) {
        if (oldValue.lengthSquared < newValue.lengthSquared) {
            oldValue.copy(newValue);
        }

        return oldValue;
    }

    reset(value: Vector2) {
        return value.reset();
    }

    #handleInputBinding(devices: InputDeviceMap, binding: InputBinding, tempValue: Vector2) {
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

    #handleInputAxis2DBinding(devices: InputDeviceMap, binding: InputAxis2DBinding, tempValue: Vector2) {
        const bindingControls = binding.controls;

        const leftSignal = this.#getSignal(devices, bindingControls.left);
        const rightSignal = this.#getSignal(devices, bindingControls.right);
        const upSignal = this.#getSignal(devices, bindingControls.up);
        const downSignal = this.#getSignal(devices, bindingControls.down);

        tempValue.set(rightSignal - leftSignal, upSignal - downSignal);
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

export default InputActionVector2Evaluator;
