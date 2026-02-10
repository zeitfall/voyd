import type InputControl from './InputControl';

abstract class InputBinding {
    #control: InputControl;

    constructor(control: InputControl) {
        this.#control = control;
    }

    get control() {
        return this.#control;
    }
}

export default InputBinding;
