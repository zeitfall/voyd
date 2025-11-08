import OrbitControls from './OrbitControls';

import { PointerMoveButton } from '~/enums';

import type { Camera } from '~/cameras';

class TrackControls extends OrbitControls {
    constructor(camera: Camera) {
        super(camera);

        this._controlBindings.track = PointerMoveButton.LMB;
        this._controlBindings.orbit = PointerMoveButton.RMB;
    }
}

export default TrackControls;
