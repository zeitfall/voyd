import { Vector3, Spherical } from '~/math';

import { clamp, defineReadOnlyProperties } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

import type { Camera } from '~/cameras';

class OrbitControls {
    declare private readonly _abortController: AbortController;

    declare private readonly _currentOrientation: Spherical; 
    declare private readonly _targetOrientation: Spherical; 

    declare private readonly _cameraOffset: Vector3;

    declare readonly camera: Camera;

    declare minAzimuthalAngle: number;
    declare maxAzimuthalAngle: number;
    declare minPolarAngle: number;
    declare maxPolarAngle: number;
    declare minRadius: number;
    declare maxRadius: number;

    declare dampingFactor: number;
    declare rotationSpeed: number;
    declare zoomingSpeed: number;

    constructor(camera: Camera) {
        const _abortController = new AbortController();

        const directionFromTarget = Vector3.direction(camera.target, camera.position) as Vector3;
        const _currentOrientation = Spherical.fromVector(directionFromTarget);
        const _targetOrientation = Spherical.fromVector(directionFromTarget);

        const _cameraOffset = Vector3.fromSpherical(_currentOrientation);

        this.minAzimuthalAngle = Number.NEGATIVE_INFINITY;
        this.maxAzimuthalAngle = Number.POSITIVE_INFINITY;
        this.minPolarAngle = -PI_OVER_TWO + Number.EPSILON;
        this.maxPolarAngle = PI_OVER_TWO - Number.EPSILON;
        this.minRadius = camera.nearPlane; // I'm not sure if it does make sense.
        this.maxRadius = camera.farPlane; // I'm not sure if it does make sense.

        this.dampingFactor = .05;
        this.rotationSpeed = .01;
        this.zoomingSpeed = .001;

		const eventListenerOptions = {
            passive: true,
            signal: _abortController.signal
        };

        defineReadOnlyProperties(this, {
            // @ts-expect-error Object literal may only specify known properties, and '_currentOrientation' does not exist in type 'Record<keyof this, unknown>'.
            _abortController,
            _currentOrientation,
            _targetOrientation,
            _cameraOffset,
            camera
        });

        window.addEventListener('pointermove', this._handlePointerMove.bind(this), eventListenerOptions);
        window.addEventListener('wheel', this._handleWheel.bind(this), eventListenerOptions);
    }

    get azimuthalAngle() {
        return this._currentOrientation.theta;
    }

    get polarAngle() {
        return this._currentOrientation.phi;
    }

    set azimuthalAngle(value: number) {
        this._currentOrientation.theta = value;

        this._clampOrientation(this._currentOrientation);
    }

    set polarAngle(value: number) {
        this._currentOrientation.phi = value;

        this._clampOrientation(this._currentOrientation);
    }

    private _clampOrientation(orientation: Spherical) {
        orientation.radius = clamp(orientation.radius, this.minRadius, this.maxRadius);
        orientation.theta = clamp(orientation.theta, this.minAzimuthalAngle, this.maxAzimuthalAngle);
        orientation.phi = clamp(orientation.phi, this.minPolarAngle, this.maxPolarAngle);
    }

    private _updateTargetOrientation(event: PointerEvent) {
        const { movementX, movementY } = event;

        this._targetOrientation.theta -= this.rotationSpeed * movementX;
        this._targetOrientation.phi -= this.rotationSpeed * movementY;

        this._clampOrientation(this._targetOrientation);
    }

    // The logic underneath is bullshit, figure out later.
    private _updateCameraPosition(event: PointerEvent) {
        const { movementX, movementY } = event;

        const movementLength = Math.sqrt(movementX * movementX + movementY * movementY) + 1e-4;

        const deltaX = .01 * movementX / movementLength;
        const deltaY = .01 * movementY / movementLength;

        this.camera.position.x -= deltaX;
        this.camera.position.z += deltaY;
        this.camera.target.x -= deltaX;
        this.camera.target.z += deltaY;
    }

    private _handlePointerMove(event: PointerEvent) {
        switch (event.buttons) {
            case 1:
                this._updateTargetOrientation(event);

                break;

            case 2:
                this._updateCameraPosition(event);

                break;
        }
    }

    private _handleWheel(event: WheelEvent) {
        this._targetOrientation.radius += this.zoomingSpeed * event.deltaY;

        this._clampOrientation(this._targetOrientation);
    }

    update() {
        const { position, target } = this.camera;

        this._currentOrientation.lerp(this._targetOrientation, this.dampingFactor);
        this._cameraOffset.setFromSpherical(this._currentOrientation);

        position.copy(target).add(this._cameraOffset);
    }

    dispose() {
        this._abortController.abort();
    }
}

export default OrbitControls;
