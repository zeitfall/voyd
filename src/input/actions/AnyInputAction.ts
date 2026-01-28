import InputAction from './InputAction';

class AnyInputAction<V = unknown> extends InputAction {
    #value: V;

    constructor(name: string, value: V) {
        super(name);

        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    set value(value: V) {
        this.#value = value;
    }

    setValue(value: V) {
        this.value = value;

        return this;
    }
}

export default AnyInputAction;
