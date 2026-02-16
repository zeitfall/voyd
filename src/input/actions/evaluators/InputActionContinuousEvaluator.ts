import { InputDeviceEventAdapterRegistry } from '../../devices';

import type { InputSingleBinding } from '../../bindings';
import type { InputControlType } from '~/enums';
import type { InputDeviceMap, InputActionEvaluator } from '~/types';

class InputActionContinuousEvaluator implements InputActionEvaluator<InputControlType.CONTINUOUS> {

    evaluate(devices: InputDeviceMap, binding: InputSingleBinding) {
        return this.#handleInputSingleBinding(devices, binding);
    }

    resolve(oldValue: number, newValue: number) {
        return Math.max(oldValue, newValue);
    }

    reset() {
        return 0;
    }

    #handleInputSingleBinding(devices: InputDeviceMap, binding: InputSingleBinding) {
        const control = binding.control;
        const controlDeviceType = control.deviceType;
        const controlKey = control.key;

        const device = devices.get(controlDeviceType);
        const deviceEvent = device && device.getEvent(controlKey);
        const deviceEventAdapter = InputDeviceEventAdapterRegistry.get(controlDeviceType);

        if (device && deviceEvent && deviceEventAdapter) {
            return deviceEventAdapter.getContinuous(deviceEvent);
        }

        return 0;
    }
}

export default InputActionContinuousEvaluator;
