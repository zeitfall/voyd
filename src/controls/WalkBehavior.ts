import ControlBehavior from './ControlBehavior';

import { Vector3 } from '~/math';
import { Camera } from '~/cameras';

import { EPSILON_12 } from '~/constants';

import type { ControlsPipelineContext } from '~/types';

class WalkBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #keys: Set<string>;

    #right: Vector3;
    #up: Vector3;
    #forward: Vector3;
    #movement: Vector3;
    #currentDirection: Vector3;
    #targetDirection: Vector3;

    dampingFactor: number;
    movementSpeed: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#keys = new Set();

        this.#right = new Vector3();
        this.#up = new Vector3();
        this.#forward = new Vector3();
        this.#movement = new Vector3();
        this.#currentDirection = new Vector3();
        this.#targetDirection = new Vector3();

        this.dampingFactor = 16;
        this.movementSpeed = 2;
    }

    setDampingFactor(damping: number) {
        this.dampingFactor = damping;

        return this;
    }

    setMovementSpeed(speed: number) {
        this.movementSpeed = speed;

        return this;
    }

    override attach(context: ControlsPipelineContext) {
        super.attach(context);

        const abortController = new AbortController();
        const eventListenerOptions = { signal: abortController.signal };

        this.#abortController = abortController;

        window.addEventListener('keydown', this.#handleKeyDown.bind(this), eventListenerOptions);
        window.addEventListener('keyup', this.#handleKeyUp.bind(this), eventListenerOptions);

        return this;
    }

    override detach() {
        super.detach();

        const abortController = this.#abortController;

        this.#keys.clear();

        if (abortController) {
            abortController.abort();
        }

        return this;
    }

    update(deltaTime: number) {
        this.#updateMovement();

        const movement = this.#movement;
        const currentDirection = this.#currentDirection;
        const targetDirection = this.#targetDirection;

        const hasInertia = currentDirection.lengthSquared > EPSILON_12;
        const hasMoved = movement.lengthSquared > EPSILON_12;

        if (this.context && (hasMoved || hasInertia)) {
            const { camera, deltaPosition, deltaTarget } = this.context;

            const right = this.#right;
            const up = this.#up;
            const forward = this.#forward;

            const lerpFraction = 1 - Math.exp(-this.dampingFactor * deltaTime);

            forward.copy(camera.forward).projectOnPlane(Camera.DEFAULT_UP).normalize();
            right.copy(Camera.DEFAULT_UP).cross(forward).normalize();
            up.copy(forward).cross(right).normalize();

            right.scale(movement.x);
            up.scale(movement.y);
            forward.scale(movement.z);

            targetDirection
                .add(right)
                .add(up)
                .add(forward)
                .setLength(this.movementSpeed * deltaTime);

            currentDirection.lerp(targetDirection, lerpFraction);

            deltaPosition.add(currentDirection);
            deltaTarget.add(currentDirection);
        }
        else {
            currentDirection.reset();
        }

        targetDirection.reset();
        
        return this;
    }

    #handleKeyDown(event: KeyboardEvent) {
        this.#keys.add(event.code);
    }

    #handleKeyUp(event: KeyboardEvent) {
        this.#keys.delete(event.code);
    }

    #updateMovement() {
        const keys = this.#keys;
        const movement = this.#movement;

        movement.reset();

        keys.forEach((key) => {
            switch(key) {
                case 'KeyA':
                case 'ArrowLeft':
                    movement.x -= 1; 

                    break;
                
                case 'KeyD':
                case 'ArrowRight':
                    movement.x += 1;

                    break;

                case 'Space':
                    movement.y += 1;

                    break;

                case 'ShiftLeft':
                    movement.y -= 1;

                    break;

                case 'KeyW':
                case 'ArrowUp':
                    movement.z += 1;

                    break;
                
                case 'KeyS':
                case 'ArrowDown':
                    movement.z -= 1;

                    break;
            }
        });
    }
}

export default WalkBehavior;
