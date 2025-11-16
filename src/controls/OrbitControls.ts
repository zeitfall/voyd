import Controls from './Controls';

import { Vector3, Spherical } from '~/math';
import { Camera } from '~/cameras';
import { PointerLockController } from '~/controllers';

import { defineReadOnlyProperties } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

import { PointerMoveButton } from '~/enums';

class OrbitControls extends Controls {
	declare private readonly _pointerLockController: PointerLockController;

	declare private readonly _trackPosition: Vector3;
	declare private readonly _trackTarget: Vector3;
	declare private readonly _trackRight: Vector3;
	declare private readonly _trackForward: Vector3;

	declare private readonly _orbitOffset: Vector3;
	declare private readonly _minOrientation: Spherical;
	declare private readonly _maxOrientation: Spherical;
	declare private readonly _currentOrientation: Spherical;
	declare private readonly _targetOrientation: Spherical;

	declare protected readonly _controlBindings: Record<'track' | 'orbit', PointerMoveButton>;

	declare rotationSpeed: number;
	declare trackingSpeed: number;
	declare zoomingSpeed: number;
	declare dampingFactor: number;

	constructor(targetElement: HTMLElement, camera: Camera) {
		super(camera);

		const handlePointerMove = (event: PointerEvent) => this._handlePointerMove(event);
		const handleWheel = (event: WheelEvent) => this._handleWheel(event);

		const _pointerLockController = new PointerLockController(targetElement, {
			locked: () => {
				window.addEventListener('pointermove', handlePointerMove, this._eventListenerOptions);
				window.addEventListener('wheel', handleWheel, this._eventListenerOptions);
			},
			unlocked: () => {
				window.removeEventListener('pointermove', handlePointerMove, this._eventListenerOptions);
				window.removeEventListener('wheel', handleWheel, this._eventListenerOptions);
			},
		});

		const _trackPosition = Vector3.clone(camera.position);
		const _trackTarget = Vector3.clone(camera.target);
		const _trackRight = Vector3.clone(camera.right);
		const _trackForward = Vector3.clone(camera.forward);

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

		defineReadOnlyProperties(this, {
			// @ts-expect-error Object literal may only specify known properties, and '_pointerLockController' does not exist in type 'Record<keyof this, unknown>'.
			_pointerLockController,
			_trackPosition,
			_trackTarget,
			_trackRight,
			_trackForward,
			_orbitOffset,
			_minOrientation,
			_maxOrientation,
			_currentOrientation,
			_targetOrientation,
			_controlBindings,
		});
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

	setRadius(radius: number) {
		this.radius = radius;

		return this;
	}

	setMinRadius(radius: number) {
		this.minRadius = radius;

		return this;
	}

	setMaxRadius(radius: number) {
		this.maxRadius = radius;

		return this;
	}

	setAzimuthAngle(angle: number) {
		this.azimuthAngle = angle;

		return this;
	}

	setMinAzimuthAngle(angle: number) {
		this.minAzimuthAngle = angle;

		return this;
	}

	setMaxAzimuthAngle(angle: number) {
		this.maxAzimuthAngle = angle;

		return this;
	}

	setPolarAngle(angle: number) {
		this.polarAngle = angle;

		return this;
	}

	setMinPolarAngle(angle: number) {
		this.minPolarAngle = angle;

		return this;
	}

	setMaxPolarAngle(angle: number) {
		this.maxPolarAngle = angle;

		return this;
	}

	setRotationSpeed(speed: number) {
		this.rotationSpeed = speed;

		return this;
	}

	setTrackingSpeed(speed: number) {
		this.trackingSpeed = speed;

		return this;
	}

	setDampingFactor(factor: number) {
		this.dampingFactor = factor;
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
		const {
            _trackRight,
            _trackForward,
            _trackPosition,
            _trackTarget,
            trackingSpeed,
            camera
        } = this;

		_trackForward.copy(camera.forward).projectOnPlane(Camera.DEFAULT_UP).normalize();
		_trackRight.copy(Camera.DEFAULT_UP).cross(_trackForward);

		_trackRight.scale(-trackingSpeed * deltaX);
		_trackForward.scale(trackingSpeed * deltaY);

		const trackDirection = _trackRight.add(_trackForward);

		_trackPosition.add(trackDirection);
		_trackTarget.add(trackDirection);

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

		position.lerp(this._trackPosition, this.dampingFactor);
		target.lerp(this._trackTarget, this.dampingFactor);

		this._currentOrientation.lerp(this._targetOrientation, this.dampingFactor);
		this._orbitOffset.setFromSpherical(this._currentOrientation);

		position.copy(target).add(this._orbitOffset);
	}

	override dispose() {
		super.dispose();

		this._pointerLockController.dispose();
	}
}

export default OrbitControls;
