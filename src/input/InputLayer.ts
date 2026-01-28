import InputAction from './actions/InputAction';

class InputLayer {
    #name: string;
    #actions: Map<string, InputAction>;

    constructor(name: string) {
        this.#name = name;
        this.#actions = new Map();
    }

    get name() {
        return this.#name;
    }

    getAction(name: string) {
        return this.#actions.get(name);
    }

    addAction(action: InputAction) {
        const actionLayer = action.layer;

        if (actionLayer !== this) {
            action.attachTo(this);
        }
        else {
            this.#actions.set(action.name, action);
        }

        return this;
    }

    removeAction(name: string) {
        const action = this.#actions.get(name);

        if (action && action.layer === this) {
            action.detach();
        }

        if (this.hasAction(name)) {
            this.#actions.delete(name);
        }
    }

    hasAction(name: string) {
        return this.#actions.has(name);
    }
}

export default InputLayer;
