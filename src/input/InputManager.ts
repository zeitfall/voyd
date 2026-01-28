import InputLayer from './InputLayer';

class InputManager {
    static #layers: Map<string, InputLayer>;

    static {
        this.#layers = new Map();
    }

    static getLayer(name: string) {
        return this.#layers.get(name);
    }

    static addLayer(layer: InputLayer) {
        this.#layers.set(layer.name, layer);

        return this;
    }

    static removeLayer(name: string) {
        this.#layers.delete(name);
    }

    static hasLayer(name: string) {
        return this.#layers.has(name);
    }

    static getAction(path: `${string}/${string}`) {
        const [layerName, actionName] = path.split('/');

        const layer = this.getLayer(layerName);

        if (layer) {
            return layer.getAction(actionName);
        }

        return undefined;
    }
}

export default InputManager;
