import type BufferAttribute from './BufferAttribute';

class Geometry {
    #attributes: Map<string, BufferAttribute>;
    #indices: Uint16Array | Uint32Array | null;

    constructor() {
        this.#attributes = new Map();
        this.#indices = null;
    }

    get attributes(): ReadonlyMap<string, BufferAttribute> {
        return this.#attributes;
    }

    get indices() {
        return this.#indices;
    }

    setIndices(indices: Uint16Array | Uint32Array) {
        this.#indices = indices;

        return this;
    }
}

export default Geometry;
