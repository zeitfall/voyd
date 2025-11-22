import ControlsPipeline from './ControlsPipeline';

import FlyBehavior from './WalkBehavior';
import OrbitBehavior from './OrbitBehavior';

import type { Camera } from '~/cameras';

class OrbitControls extends ControlsPipeline {
    constructor(camera: Camera) {
        super(camera);

        const flyBehavior = new FlyBehavior();
        const orbitBehavior = new OrbitBehavior();

        this.add(flyBehavior).add(orbitBehavior);
    }
}

export default OrbitControls;
