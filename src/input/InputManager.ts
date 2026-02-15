import type InputAction from './actions/InputAction';
import type { InputDeviceType, InputControlType } from '~/enums';
import type { InputDevice } from '~/types';

class InputManager {
    #devices: Map<InputDeviceType, InputDevice>;
    #actions: Map<unknown, InputAction<InputControlType>>;

    constructor() {
        this.#devices = new Map();
        this.#actions = new Map();
    }

    registerDevice(device: InputDevice) {
        const devices = this.#devices;

        const deviceType = device.type;
        const hasDeviceRegistered = devices.has(deviceType);

        if (hasDeviceRegistered) {
            throw new Error(`[InputManager]: Device with type "${deviceType}" has already been registered.`);
        }

        device.connect();

        devices.set(deviceType, device);

        return this;
    }

    unregisterDevice(deviceType: InputDeviceType) {
        const devices = this.#devices;

        const device = devices.get(deviceType);

        if (!device) {
            throw new Error(`[InputManager]: Cannot unregister. Device with type "${deviceType}" was not found.`);
        }

        device.disconnect();

        devices.delete(deviceType);
    }

    unregisterAllDevices() {
        this.#devices.forEach(device => device.disconnect());

        this.#devices.clear();
    }

    getDevice(type: InputDeviceType) {
        return this.#devices.get(type);
    }

    hasDevice(type: InputDeviceType) {
        return this.#devices.has(type);
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
