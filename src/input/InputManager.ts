import type InputAction from './actions/InputAction';
import type { InputControlType, InputDeviceType } from '~/enums';
import type { InputDevice } from '~/types';

class InputManager {
    #devices: Map<InputDeviceType, InputDevice>;
    #actions: Map<string, InputAction<InputControlType>>;

    constructor() {
        this.#devices = new Map();
        this.#actions = new Map();
    }

    getDevice(type: InputDeviceType) {
        return this.#devices.get(type);
    }

    hasDevice(type: InputDeviceType) {
        return this.#devices.has(type);
    }

    registerDevice(device: InputDevice) {
        const deviceType = device.type;
        const hasDeviceRegistered = this.#devices.has(deviceType);

        if (hasDeviceRegistered) {
            throw new Error(`[InputManager]: Device with type "${deviceType}" has already been registered.`);
        }

        device.connect();

        this.#devices.set(deviceType, device);

        return this;
    }

    unregisterDevice(deviceType: InputDeviceType) {
        const device = this.#devices.get(deviceType);

        if (!device) {
            throw new Error(`[InputManager]: Cannot unregister. Device with type "${deviceType}" was not found.`);
        }

        device.disconnect();

        this.#devices.delete(deviceType);
    }

    unregisterAllDevices() {
        this.#devices.forEach(device => device.disconnect());

        this.#devices.clear();
    }

    addAction(action: InputAction<InputControlType>) {
        this.#actions.set(action.name, action);

        return this;
    }

    removeAction(name: string) {
        this.#actions.delete(name);
    }

    hasAction(name: string) {
        return this.#actions.has(name);
    }

    update() {
        this.#actions.forEach(action => action.update(this.#devices));
    }
}

const inputManagerInstance = new InputManager();

export default inputManagerInstance;
