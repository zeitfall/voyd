import { Vector3, Quaternion } from '~/math';
import { SceneComponent, SceneNode } from '~/scene';

import type { TransformBehavior } from './behaviors';

interface TransformControllerContext {
    targetPosition: Vector3;
    targetRotation: Quaternion;
}

class TransformController extends SceneComponent {
    #behaviors: Set<TransformBehavior>;

    #context: TransformControllerContext;

    constructor() {
        super();

        this.#behaviors = new Set();

        this.#context = {
            targetPosition: new Vector3(),
            targetRotation: new Quaternion(),
        };
    }

    get context() {
        return this.#context;
    }

    override attachTo(node: SceneNode) {
        super.attachTo(node);

        const context = this.#context;
        const nodeTransform = node.transform;

        context.targetPosition.copy(nodeTransform.position);
        context.targetRotation.copy(nodeTransform.rotation);

        return this;
    }

    override detach() {
        super.detach();

        const context = this.#context;

        context.targetPosition.reset();
        context.targetRotation.reset();
    }

    addBehavior(behavior: TransformBehavior) {
        const behaviorController = behavior.controller;

        if (behaviorController !== this) {
            behavior.attachTo(this);
        }
        else {
            this.#behaviors.add(behavior);
        }

        return this;
    }

    removeBehavior(behavior: TransformBehavior) {
        const behaviorController = behavior.controller;

        if (behaviorController === this) {
            behavior.detach();
        }

        if (this.hasBehavior(behavior)) {
            this.#behaviors.delete(behavior);
        }
    }

    hasBehavior(behavior: TransformBehavior) {
        return this.#behaviors.has(behavior);
    }

    update(deltaTime: number) {
        const node = this.node;
        
        if (node) {
            const nodeTransform = node.transform;
            const nodePosition = nodeTransform.position;
            const nodeRotation = nodeTransform.rotation;

            const { targetPosition, targetRotation } = this.#context;

            targetPosition.copy(nodePosition);
            targetRotation.copy(nodeRotation);

            this.#behaviors.forEach((behavior) => {
                behavior.update(deltaTime);
            });

            nodePosition.copy(targetPosition);
            nodeRotation.copy(targetRotation);
        }
    }
}

export default TransformController;
