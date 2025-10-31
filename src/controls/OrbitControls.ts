import { defineReadOnlyProperties } from '~/utils';

import type { Camera } from '~/cameras';

class OrbitControls {
    declare readonly camera: Camera;

    constructor(camera: Camera) {
        defineReadOnlyProperties(this, { camera });
    }
}

export default OrbitControls;
