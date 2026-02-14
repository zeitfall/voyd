import { InputDeviceEventAdapterRegistry } from '../../devices';

import type { InputBinding } from '../../bindings';
import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator } from '~/types';

class InputActionDiscreteEvaluator implements InputActionEvaluator<InputControlType.DISCRETE> {

    evaluate(devices: InputDeviceMap, binding: InputBinding) {
        return this.#handleInputBinding(devices, binding);
    }

    resolve(oldValue: number, newValue: number) {
        return oldValue | newValue;
    }

    reset() {
        return 0;
    }

    #handleInputBinding(devices: InputDeviceMap, binding: InputBinding) {
        const control = binding.control;
        const controlDeviceType = control.deviceType;
        const controlKey = control.key;

        const device = devices.get(controlDeviceType);
        const deviceEvent = device && device.getEvent(controlKey);
        const deviceEventAdapter = InputDeviceEventAdapterRegistry.get(controlDeviceType);

        if (device && deviceEvent && deviceEventAdapter) {
            return deviceEventAdapter.getDiscrete(deviceEvent);
        }

        return 0;
    }
}

export default InputActionDiscreteEvaluator;
