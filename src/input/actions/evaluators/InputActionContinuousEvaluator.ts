import type { InputSingleBinding } from '../../bindings';
import type { InputControlType } from '../../enums';
import type { InputDeviceMap, InputActionEvaluator } from '../../types';

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
        const { control } = binding;

        const device = devices.get(control.deviceType);
        const deviceEvent = device && device.getEvent(control.key);

        if (deviceEvent) {
            return device.eventAdapter.getContinuous(deviceEvent);
        }

        return 0;
    }
}

export default InputActionContinuousEvaluator;
