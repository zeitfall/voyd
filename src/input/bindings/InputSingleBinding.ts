import InputBinding from './InputBinding';
import InputControl from './InputControl';

import type { InputControlReference } from '~/types';

class InputSingleBinding extends InputBinding {
    #control: InputControl;

    constructor(descriptor: InputControlReference) {
        super();

        const { deviceType, key } = descriptor;

        this.#control = new InputControl(deviceType, key);
    }

    get control() {
        return this.#control;
    }
}

export default InputSingleBinding;
