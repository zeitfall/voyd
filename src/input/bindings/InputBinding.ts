import InputControl from './InputControl';

import type { InputControlReference } from '~/types';

class InputBinding {
    #control: InputControl;

    constructor(descriptor: InputControlReference) {
        const { deviceType, key } = descriptor;

        this.#control = new InputControl(deviceType, key);
    }

    get control() {
        return this.#control;
    }
}

export default InputBinding;
