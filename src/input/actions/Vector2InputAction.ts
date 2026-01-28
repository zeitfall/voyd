import InputAction from './InputAction';

import { Vector2 } from '~/math';

class Vector2InputAction extends InputAction {
    #value: Vector2;

    constructor(name: string) {
        super(name);

        this.#value = new Vector2();
    }

    get value() {
        return this.#value;
    }
}

export default Vector2InputAction;
