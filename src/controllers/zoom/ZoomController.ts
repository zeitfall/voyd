import { SceneComponent } from '~/scene';
import {
    InputManager,
    InputAction,
    InputSingleBinding,
    InputDeviceType,
    InputControlType
} from '~/input';

import { clamp, damp } from '~/math';

import type { ZoomStrategy } from '../types';

class ZoomController extends SceneComponent {
    #strategy: ZoomStrategy;

    #inputAction: InputAction<InputControlType.AXIS>;

    #currentZoomLevel: number;
    #desiredZoomLevel: number;
    #maxZoomIn: number;
    #maxZoomOut: number;

    #dampingFactor: number;
    #zoomSpeed: number;

    constructor(strategy: ZoomStrategy) {
        super();

        this.#strategy = strategy;

        this.#inputAction = this.#setupInputAction();

        this.#currentZoomLevel = 1;
        this.#desiredZoomLevel = 1;
        this.#maxZoomIn = strategy.maxSafeZoomIn;
        this.#maxZoomOut = strategy.maxSafeZoomOut;

        this.#dampingFactor = 12;
        this.#zoomSpeed = 0.005;
    }

    get zoomLevel() {
        return this.#desiredZoomLevel;
    }

    set zoomLevel(value: number) {
        this.#desiredZoomLevel = clamp(value, this.maxZoomOut, this.maxZoomIn);
    }

    get maxZoomIn() {
        return this.#maxZoomIn;
    }

    set maxZoomIn(value: number) {
        this.#maxZoomIn = Math.min(value, this.#strategy.maxSafeZoomIn);
    }

    get maxZoomOut() {
        return this.#maxZoomOut;
    }

    set maxZoomOut(value: number) {
        this.#maxZoomOut = Math.max(value, this.#strategy.maxSafeZoomOut);
    }

    get zoomSpeed() {
        return this.#zoomSpeed;
    }

    set zoomSpeed(value: number) {
        this.#zoomSpeed = Math.max(0, value);
    }

    get dampingFactor() {
        return this.#dampingFactor;
    }

    set dampingFactor(value: number) {
        this.#dampingFactor = Math.max(0, value);
    }

    setStrategy(strategy: ZoomStrategy) {
        this.#strategy = strategy;

        return this;
    }

    setZoomLevel(value: number) {
        this.zoomLevel = value;

        return this;
    }

    setMaxZoomIn(value: number) {
        this.maxZoomIn = value;

        return this;
    }

    setMaxZoomOut(value: number) {
        this.maxZoomOut = value;

        return this;
    }

    setZoomSpeed(value: number) {
        this.zoomSpeed = value;

        return this;
    }

    setDampingFactor(value: number) {
        this.dampingFactor = value;

        return this;
    }

    update(deltaTime: number) {
        const node = this.node;

        if (!node) {
            return;
        }

        const deltaZoom = this.#inputAction.value;

        if (deltaZoom !== 0) {
            this.zoomLevel += this.#zoomSpeed * deltaZoom;
        }

        this.#currentZoomLevel = damp(this.#currentZoomLevel, this.#desiredZoomLevel, this.#dampingFactor, deltaTime);

        this.#strategy.apply(node, this.#currentZoomLevel);
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
