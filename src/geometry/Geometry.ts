import type { BufferView } from '~/types';

class Geometry {
    #attributes: Map<string, BufferView>;
    #indices: Uint16Array | Uint32Array | null;

    constructor() {
        this.#attributes = new Map();
        this.#indices = null;
    }

    get indices() {
        return this.#indices;
    }

    setAttribute(name: string, attribute: BufferView) {
        this.#attributes.set(name, attribute);

        return this;
    }

    removeAttribute(name: string) {
        this.#attributes.delete(name);
    }

    hasAttribute(name: string) {
        return this.#attributes.has(name);
    }

    setIndices(indices: Uint16Array | Uint32Array) {
        this.#indices = indices;

        return this;
    }
}

export default Geometry;
