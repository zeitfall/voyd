import type { ControlsPipelineContext } from '~/types';

abstract class ControlBehavior {
    #context: ControlsPipelineContext | null;

    constructor() {
        this.#context = null;
    }

    get context() {
        return this.#context;
    }

    attach(context: ControlsPipelineContext) {
        this.#context = context;

        return this;
    }

    detach() {
        this.#context = null;

        return this;
    }

    abstract update(deltaTime: number): this;
}

export default ControlBehavior;
