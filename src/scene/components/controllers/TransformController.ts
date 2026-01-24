import { Vector3, Quaternion } from '~/math';
import { SceneComponent, SceneNode } from '~/scene';

import { TransformControllerBinding } from '~/enums';

import type { TransformBehavior } from './behaviors';

interface TransformControllerContext {
    targetPosition: Vector3;
    targetRotation: Quaternion;
}

class TransformController extends SceneComponent {
    #behaviors: Map<TransformBehavior, TransformControllerBinding>;
    #context: TransformControllerContext;

    #abortController: AbortController | null;
    #pointerIds: Set<number>;
    #transformBindings: TransformControllerBinding;

    constructor(eventTarget: HTMLElement) {
        super();

        this.#behaviors = new Map();
        this.#context = {
            targetPosition: new Vector3(),
            targetRotation: new Quaternion()
        };

        this.#abortController = null;
        this.#pointerIds = new Set();
        this.#transformBindings = TransformControllerBinding.NONE;

        this.#initEventListeners(eventTarget);
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

        const abortController = this.#abortController;

        if (abortController) {
            abortController.abort();

            this.#abortController = null;
        }

        const context = this.#context;

        context.targetPosition.reset();
        context.targetRotation.reset();
    }

    addBehavior(binding: TransformControllerBinding, behavior: TransformBehavior) {
        const behaviorController = behavior.controller;

        if (behaviorController !== this) {
            behavior.attachTo(binding, this);
        }
        else {
            this.#behaviors.set(behavior, binding);
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

            let haveBehaviorsFinished = true;

            targetPosition.copy(nodePosition);
            targetRotation.copy(nodeRotation);

            switch (this.#pointerIds.size) {
                case 1:
                    this.#transformBindings |= TransformControllerBinding.TOUCHES_1;

                    break;

                case 2:
                    this.#transformBindings |= TransformControllerBinding.TOUCHES_2;

                    break;

                default:
                    this.#transformBindings &= ~(TransformControllerBinding.TOUCHES_1 | TransformControllerBinding.TOUCHES_2);
            }

            this.#behaviors.forEach((binding, behavior) => {
                const behaviorActive = (this.#transformBindings & binding) === binding;

                haveBehaviorsFinished &&= behavior.update(deltaTime, behaviorActive);
            });

            if (haveBehaviorsFinished) {
                this.#transformBindings &= ~TransformControllerBinding.POINTER_MOVE;
            }

            nodePosition.copy(targetPosition);
            nodeRotation.copy(targetRotation);
        }
    }

    #initEventListeners(eventTarget: HTMLElement) {
        let abortController = this.#abortController;

        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        eventTarget.addEventListener('pointerdown', (event) => this.#handlePointerDown(event), eventListenerOptions);
        eventTarget.addEventListener('pointerup', (event) => this.#handlePointerUp(event), eventListenerOptions);
        eventTarget.addEventListener('pointermove', (event) => this.#handlePointerMove(event), eventListenerOptions);
    }

    #handlePointerDown(event: PointerEvent) {
        if (event.pointerType === 'touch') {
            this.#pointerIds.add(event.pointerId);
        }

        switch (event.button) {
            case 0:
                this.#transformBindings |= TransformControllerBinding.POINTER_LMB;

                break;
            
            case 1:
                this.#transformBindings |= TransformControllerBinding.POINTER_MMB;

                break;

            case 2:
                this.#transformBindings |= TransformControllerBinding.POINTER_RMB;

                break;
        }
    }

    #handlePointerUp(event: PointerEvent) {
        this.#pointerIds.delete(event.pointerId);

        switch (event.button) {
            case 0:
                this.#transformBindings &= ~TransformControllerBinding.POINTER_LMB;

                break;
            
            case 1:
                this.#transformBindings &= ~TransformControllerBinding.POINTER_MMB;

                break;

            case 2:
                this.#transformBindings &= ~TransformControllerBinding.POINTER_RMB;

                break;
        }
    }

    #handlePointerMove(event: PointerEvent) {
        this.#transformBindings |= TransformControllerBinding.POINTER_MOVE;
    }
}

export default TransformController;
