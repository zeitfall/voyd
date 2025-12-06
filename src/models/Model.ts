import type { Geometry } from '~/geometries';

class Model {
    #geometry: Geometry;
    #material: unknown;

    constructor(geometry: Geometry, material: unknown) {
        this.#geometry = geometry;
        this.#material = material;
    }

    get geometry() {
        return this.#geometry;
    }

    get material() {
        return this.#material;
    }
}

export default Model;
