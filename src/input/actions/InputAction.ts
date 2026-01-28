import type InputLayer from '../InputLayer';

abstract class InputAction {
    #name: string;
    #layer: InputLayer | null;

    constructor(name: string) {
        this.#name = name;
        this.#layer = null;
    }

    get name() {
        return this.#name;
    }

    get layer() {
        return this.#layer;
    }

    abstract get value(): unknown;

    attachTo(layer: InputLayer) {
        const name = this.#name;
        const currentLayer = this.#layer;

        if (currentLayer && currentLayer !== layer) {
            currentLayer.removeAction(name);
        }

        this.#layer = layer;

        layer.addAction(this); 

        return this;
    }

    detach() {
        const layer = this.#layer;

        if (layer) {
            this.#layer = null;

            layer.removeAction(this.name);
        }
    }
}

export default InputAction;