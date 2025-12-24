import type { Geometry } from '~/geometries';
import type { Material } from '~/materials';

class Mesh {
    #geometry: Geometry;
    #material: Material;

    constructor(geometry: Geometry, material: Material) {
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

export default Mesh;
