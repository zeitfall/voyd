import SceneComponent from '../SceneComponent';

import type { Geometry } from '~/geometry';
import type { Material } from '~/materials';

// https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Mesh.html
class Mesh extends SceneComponent {
    #geometry: Geometry;
    #material: Material;

    constructor(geometry: Geometry, material: Material) {
        super();

        this.#geometry = geometry;
        this.#material = material;
    }

    get geometry() {
        return this.#geometry;
    }

    get material() {
        return this.#material;
    }

    update(deltaTime: number) {}
}

export default Mesh;
