import ControlBehavior from './ControlBehavior';

import { Vector3 } from '~/math';
import { Camera } from '~/cameras';

import type { ControlsPipelineContext } from '~/types';

class WalkBehavior extends ControlBehavior {
    #abortController: AbortController | null;

    #keys: Set<string>;

    #right: Vector3;
    #up: Vector3;
    #forward: Vector3;

    movementSpeed: number;

    constructor() {
        super();

        this.#abortController = null;

        this.#keys = new Set();

        this.#right = new Vector3();
        this.#up = new Vector3();
        this.#forward = new Vector3();

        this.movementSpeed = .01;
    }

    #handleKeyDown(event: KeyboardEvent) {
        this.#keys.add(event.code);
    }

    #handleKeyUp(event: KeyboardEvent) {
        this.#keys.delete(event.code);
    }

    #updateDeltas(directionX: number, directionY: number, directionZ: number) {
        if (this.context) {
            const { camera, deltaPosition, deltaTarget } = this.context;

            const right = this.#right;
            const up = this.#up;
            const forward = this.#forward;

            forward.copy(camera.forward).projectOnPlane(Camera.DEFAULT_UP).normalize();
            right.copy(Camera.DEFAULT_UP).cross(forward).normalize();
            up.copy(forward).cross(right).normalize();

            right.scale(this.movementSpeed * directionX);
            up.scale(this.movementSpeed * directionY);
            forward.scale(this.movementSpeed * directionZ);

            const deltaDirection = right.add(up).add(forward);

            deltaPosition.add(deltaDirection);
            deltaTarget.add(deltaDirection);
        }
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

    setMovementSpeed(speed: number) {
        this.movementSpeed = speed;

        return this;
    }

    update() {
        this.#keys.forEach((key) => {
            switch(key) {
                case 'KeyA':
                case 'ArrowLeft':
                    this.#updateDeltas(-1, 0, 0);

                    break;
                
                case 'KeyD':
                case 'ArrowRight':
                    this.#updateDeltas(1, 0, 0);

                    break;

                case 'Space':
                    this.#updateDeltas(0, 1, 0);

                    break;

                case 'ShiftLeft':
                    this.#updateDeltas(0, -1, 0);

                    break;

                case 'KeyW':
                case 'ArrowUp':
                    this.#updateDeltas(0, 0, 1);

                    break;
                
                case 'KeyS':
                case 'ArrowDown':
                    this.#updateDeltas(0, 0, -1);

                    break;
            } 
        });

        return this;
    }
}

export default WalkBehavior;
