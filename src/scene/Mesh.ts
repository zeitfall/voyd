import type { Geometry } from '~/geometries';
import type { Material } from '~/materials';

// https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Mesh.html
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
