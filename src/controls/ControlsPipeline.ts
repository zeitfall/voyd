import { Vector3 } from '~/math';

import { defineReadOnlyProperties, defineWritableProperties } from '~/utils';

import type ControlBehavior from './ControlBehavior';
import type { Camera } from '~/cameras';
import type { ControlsPipelineContext } from '~/types';

class ControlsPipeline {
    #behaviors: Set<ControlBehavior>;
    #context: ControlsPipelineContext;

    constructor(camera: Camera) {
        this.#behaviors = new Set();
        this.#context = {} as ControlsPipelineContext;

        const deltaPosition = new Vector3();
        const deltaTarget = new Vector3();

        defineReadOnlyProperties(this.#context, { camera, deltaPosition, deltaTarget });
        defineWritableProperties(this.#context, { enabled: true });
    }

    get enabled() {
        return this.#context.enabled;
    }

    set enabled(value: boolean) {
        this.#context.enabled = value;
    }

    add(behavior: ControlBehavior) {
        behavior.attach(this.#context);

        this.#behaviors.add(behavior);

        return this;
    }

    enable() {
        this.enabled = true;

        return this;
    }

    disable() {
        this.enabled = false;

        return this;
    }

    update(deltaTime: number) {
        const { camera, deltaPosition, deltaTarget, enabled } = this.#context;

        if (enabled) {
            this.#behaviors.forEach((behavior) => {
                behavior.update(deltaTime);
            });

            camera.position.add(deltaPosition);
            camera.target.add(deltaTarget);
        }

        deltaPosition.reset();
        deltaTarget.reset();
    }
}

export default ControlsPipeline;
