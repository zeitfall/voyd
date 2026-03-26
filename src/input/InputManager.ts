import type { InputAction } from './actions';
import type { InputDeviceType } from './enums';
import type { InputDevice, InputActionID } from './types';

const devices = new Map<InputDeviceType, InputDevice>();
const actions = new Map<InputActionID, InputAction>();

function registerDevice(device: InputDevice) {
    const deviceType = device.type;
    const hasDeviceRegistered = devices.has(deviceType);

    if (hasDeviceRegistered) {
        throw new Error(`[InputManager]: Device with type "${deviceType}" has already been registered.`);
    }

    device.connect();

    devices.set(deviceType, device);
}

function unregisterDevice(deviceType: InputDeviceType) {
    const device = devices.get(deviceType);

    if (!device) {
        throw new Error(`[InputManager]: Cannot unregister. Device with type "${deviceType}" was not found.`);
    }

    device.disconnect();

    devices.delete(deviceType);
}

function unregisterAllDevices() {
    devices.forEach(device => device.disconnect());
    devices.clear();
}

function getDevice(type: InputDeviceType) {
    return devices.get(type);
}

function hasDevice(type: InputDeviceType) {
    return devices.has(type);
}

function addAction(action: InputAction) {
    actions.set(action.id, action);
}

function removeAction(name: string) {
    actions.delete(name);
}

function hasAction(name: string) {
    return actions.has(name);
}

function update() {
    actions.forEach(action => action.update(devices));
    devices.forEach(device => device.flush());
}

export {
    registerDevice,
    unregisterDevice,
    unregisterAllDevices,
    getDevice,
    hasDevice,
    addAction,
    removeAction,
    hasAction,
    update
};
