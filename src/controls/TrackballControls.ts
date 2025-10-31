import { defineReadOnlyProperties } from '~/utils';

import type { Camera } from '~/cameras';

class TrackballControls {
    declare readonly camera: Camera;

    constructor(camera: Camera) {
        defineReadOnlyProperties(this, { camera });
    }
}

export default TrackballControls;
