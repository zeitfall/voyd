import ControlsPipeline from './ControlsPipeline';

import FlyBehavior from './FlyBehavior';
import LookBehavior from './LookBehavior';
import PointerLockBehavior from './PointerLockBehavior';

import type { Camera } from '~/cameras';

class FlyControls extends ControlsPipeline {
    constructor(targetElement: HTMLElement, camera: Camera) {
        super(camera);

        const flyBehavior = new FlyBehavior();
        const lookBehavior = new LookBehavior();
        const pointerLockBehavior = new PointerLockBehavior(targetElement);

        this.add(pointerLockBehavior).add(flyBehavior).add(lookBehavior);
    }
}

export default FlyControls;
