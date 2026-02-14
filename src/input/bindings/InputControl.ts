import type { InputDeviceType } from '~/enums';

class InputControl {
    #deviceType: InputDeviceType;
    #key: unknown;

    constructor(deviceType: InputDeviceType, key: unknown) {
        this.#deviceType = deviceType;
        this.#key = key;
    }

    get deviceType() {
        return this.#deviceType;
    }

    get key() {
        return this.#key;
    }
}

export default InputControl;
