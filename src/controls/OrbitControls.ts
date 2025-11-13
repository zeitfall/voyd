import { Vector3, Spherical } from '~/math';

import { Camera } from '~/cameras';

import { defineReadOnlyProperties } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

import { PointerMoveButton } from '~/enums';

class OrbitControls {
	declare private readonly _abortController: AbortController;

	declare private readonly _trackRight: Vector3;
	declare private readonly _trackForward: Vector3;
	declare private readonly _trackCameraPosition: Vector3;
	declare private readonly _trackCameraTarget: Vector3;
	declare private readonly _trackOffset: Vector3;

	declare private readonly _orbitOffset: Vector3;
	declare private readonly _minOrientation: Spherical;
	declare private readonly _maxOrientation: Spherical;
	declare private readonly _currentOrientation: Spherical;
	declare private readonly _targetOrientation: Spherical;

	declare protected readonly _controlBindings: Record<'track' | 'orbit', PointerMoveButton>;

	declare readonly camera: Camera;

	declare dampingFactor: number;
	declare rotationSpeed: number;
	declare trackingSpeed: number;
	declare zoomingSpeed: number;

	constructor(camera: Camera) {
		const _abortController = new AbortController();

		const _trackRight = new Vector3();
		const _trackForward = new Vector3();
		const _trackCameraPosition = new Vector3();
		const _trackCameraTarget = new Vector3();
		const _trackOffset = new Vector3();

		const _orbitOffset = Vector3.direction(camera.target, camera.position);
		const _minOrientation = new Spherical(camera.nearPlane, Number.NEGATIVE_INFINITY, -PI_OVER_TWO + Number.EPSILON);
		const _maxOrientation = new Spherical(camera.farPlane, Number.POSITIVE_INFINITY, PI_OVER_TWO - Number.EPSILON);
		const _currentOrientation = Spherical.fromVector(_orbitOffset);
		const _targetOrientation = Spherical.fromVector(_orbitOffset);

		const _controlBindings = {
			track: PointerMoveButton.RMB,
			orbit: PointerMoveButton.LMB,
		};

		this.dampingFactor = 0.05;
		this.rotationSpeed = 0.01;
		this.trackingSpeed = 0.01;
		this.zoomingSpeed = 0.001;

		const eventListenerOptions = {
			signal: _abortController.signal,
			passive: true,
		};

		defineReadOnlyProperties(this, {
			// @ts-expect-error Object literal may only specify known properties, and '_abortController' does not exist in type 'Record<keyof this, unknown>'.
			_abortController,
			_trackRight,
			_trackForward,
			_trackCameraPosition,
			_trackCameraTarget,
			_trackOffset,
			_orbitOffset,
			_minOrientation,
			_maxOrientation,
			_currentOrientation,
			_targetOrientation,
			_controlBindings,
			camera,
		});

		window.addEventListener('pointermove', this._handlePointerMove.bind(this), eventListenerOptions);
		window.addEventListener('wheel', this._handleWheel.bind(this), eventListenerOptions);
	}

	get radius() {
		return this._currentOrientation.radius;
	}

	get minRadius() {
		return this._minOrientation.radius;
	}

	get maxRadius() {
		return this._maxOrientation.radius;
	}

	get azimuthAngle() {
		return this._currentOrientation.theta;
	}

	get minAzimuthAngle() {
		return this._minOrientation.theta;
	}

	get maxAzimuthAngle() {
		return this._maxOrientation.theta;
	}

	get polarAngle() {
		return this._currentOrientation.phi;
	}

	get minPolarAngle() {
		return this._minOrientation.phi;
	}

	get maxPolarAngle() {
		return this._maxOrientation.phi;
	}

	set radius(value: number) {
		this._targetOrientation.radius = value;

		this._clampOrientation(this._targetOrientation);
	}

	set minRadius(value: number) {
		this._minOrientation.radius = value;
	}

	set maxRadius(value: number) {
		this._maxOrientation.radius = value;
	}

	set azimuthAngle(value: number) {
		this._targetOrientation.theta = value;

		this._clampOrientation(this._targetOrientation);
	}

	set minAzimuthAngle(value: number) {
		this._minOrientation.theta = value;
	}

	set maxAzimuthAngle(value: number) {
		this._maxOrientation.theta = value;
	}

	set polarAngle(value: number) {
		this._targetOrientation.phi = value;

		this._clampOrientation(this._targetOrientation);
	}

	set minPolarAngle(value: number) {
		this._minOrientation.phi = value;
	}

	set maxPolarAngle(value: number) {
		this._maxOrientation.phi = value;
	}

	private _clampOrientation(orientation: Spherical) {
		orientation.clamp(this._minOrientation, this._maxOrientation);
	}

	private _handlePointerMove(event: PointerEvent) {
		const { buttons, movementX, movementY } = event;

		switch (buttons) {
			case this._controlBindings.orbit:
				this.orbit(movementX, movementY);

				break;

			case this._controlBindings.track:
				this.track(movementX, movementY);

				break;
		}
	}

	private _handleWheel(event: WheelEvent) {
		// TBD: Implement zooming effect for perspective and orthographic cameras.
		// if (this.camera instanceof PerspectiveCamera) {
		// 	this.camera.fovy += this.zoomingSpeed * event.deltaY;
		// }		
	}

	orbit(deltaX: number, deltaY: number) {
		this._targetOrientation.theta -= this.rotationSpeed * deltaX;
		this._targetOrientation.phi -= this.rotationSpeed * deltaY;

		this._clampOrientation(this._targetOrientation);

		return this;
	}

	orbitX(deltaX: number) {
		return this.orbit(deltaX, 0);
	}

	orbitY(deltaY: number) {
		return this.orbit(0, deltaY);
	}

	track(deltaX: number, deltaY: number) {
		this._trackForward.copy(this.camera.forward).projectOnPlane(Camera.DEFAULT_UP).normalize();
		this._trackRight.copy(Camera.DEFAULT_UP).cross(this._trackForward);

		this._trackRight.scale(-this.trackingSpeed * deltaX);
		this._trackForward.scale(this.trackingSpeed * deltaY);

		const trackDirection = this._trackRight.add(this._trackForward);

		this._trackCameraPosition.add(trackDirection);
		this._trackCameraTarget.add(trackDirection);

		return this;
	}

	trackX(deltaX: number) {
		return this.track(deltaX, 0);
	}

	trackY(deltaY: number) {
		return this.track(0, deltaY);
	}

	update() {
		const { position, target } = this.camera;

		position.lerp(this._trackCameraPosition, this.dampingFactor);
		target.lerp(this._trackCameraTarget, this.dampingFactor);

		this._currentOrientation.lerp(this._targetOrientation, this.dampingFactor);
		this._orbitOffset.setFromSpherical(this._currentOrientation);

		position.copy(target).add(this._orbitOffset);

		return this;
	}

	dispose() {
		this._abortController.abort();
	}
}

export default OrbitControls;
