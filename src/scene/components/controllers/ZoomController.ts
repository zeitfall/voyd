import SceneComponent from '../SceneComponent';

import {
    InputManager,
    InputAction,
    InputSingleBinding
} from '~/input';

import { clamp, damp } from '~/utils';

import { InputDeviceType, InputControlType } from '~/enums';

import type SceneNode from '../../SceneNode';

class ZoomController extends SceneComponent {
    #inputAction: InputAction<InputControlType.AXIS>;

    #currentDistance: number;
    #desiredDistance: number;
    minDistance: number;
    maxDistance: number;

    #dampingFactor: number;
    #zoomSpeed: number;

    constructor() {
        super();

        this.#inputAction = this.#setupInputAction();

        this.#currentDistance = 0;
        this.#desiredDistance = 0;
        this.minDistance = Number.EPSILON;
        this.maxDistance = Number.POSITIVE_INFINITY;

        this.#dampingFactor = 8;
        this.#zoomSpeed = 0.25;

    }

    get dampingFactor() {
        return this.#dampingFactor;
    }

    set dampingFactor(value: number) {
        this.#dampingFactor = Math.max(0, value);
    }

    get zoomSpeed() {
        return this.#zoomSpeed;
    }

    set zoomSpeed(value: number) {
        this.#zoomSpeed = Math.max(0, value);
    }

    setDampingFactor(value: number) {
        this.dampingFactor = value;

        return this;
    }

    setZoomSpeed(value: number) {
        this.zoomSpeed = value;

        return this;
    }

    setMinDistance(value: number) {
        this.minDistance = value;

        return this;
    }

    setMaxDistance(value: number) {
        this.maxDistance = value;

        return this;
    }

    override attachTo(node: SceneNode) {
        super.attachTo(node);

        const distanceFromParentCenter = node.transform.position.length;

        this.#currentDistance = this.#desiredDistance = distanceFromParentCenter;

        return this;
    }

    update(deltaTime: number) {
        const node = this.node;

        if (!node) {
            return;
        }

        const inputActionValue = this.#inputAction.value;

        if (inputActionValue !== 0) {
            this.#desiredDistance = clamp(
                this.#desiredDistance - this.#zoomSpeed * inputActionValue,
                this.minDistance,
                this.maxDistance
            );
        }

        this.#currentDistance = damp(this.#currentDistance, this.#desiredDistance, this.#dampingFactor, deltaTime);

        node.transform.position.setLength(this.#currentDistance);
    }

    #setupInputAction() {
        const inputActionID = Symbol('ZoomController');
        const inputAction = new InputAction(inputActionID, InputControlType.AXIS);

        const inputWheelBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: 'MouseWheel' });
        const inputTouchBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: 'TouchPinch' });

        inputAction.bindings.add(inputWheelBinding);
        inputAction.bindings.add(inputTouchBinding);

        InputManager.addAction(inputAction);

        return inputAction;
    }
}

export default ZoomController;