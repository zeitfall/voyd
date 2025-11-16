import Controls from './Controls';

import { Vector3, Spherical } from '~/math';
import { Camera } from '~/cameras';
import { KeyboardController, PointerLockController } from '~/controllers';

import { defineReadOnlyProperties } from '~/utils';

import { PI_OVER_TWO } from '~/constants';

class FirstPersonControls extends Controls {
	declare private readonly _keyboardController: KeyboardController;
	declare private readonly _pointerLockController: PointerLockController;

	declare private readonly _trackPosition: Vector3;
	declare private readonly _trackTarget: Vector3;
	declare private readonly _trackRight: Vector3;
	declare private readonly _trackUp: Vector3;
	declare private readonly _trackForward: Vector3;

	declare private readonly _minOrientation: Spherical;
	declare private readonly _maxOrientation: Spherical;
	declare private readonly _currentOrientation: Spherical;
	declare private readonly _targetOrientation: Spherical;

	declare pointerSpeed: number;
	declare trackingSpeed: number;
	declare dampingFactor: number;

	constructor(targetElement: HTMLElement, camera: Camera) {
		super(camera);

		const moveForward = () => this.track(0, 0, 1);
		const moveBackward = () => this.track(0, 0, -1);
		const moveLeft = () => this.track(-1, 0, 0);
		const moveRight = () => this.track(1, 0, 0);
		const moveUp = () => this.track(0, 1, 0);
		const moveDown = () => this.track(0, -1, 0);

		const handlePointerMove = (event: PointerEvent) => this._handlePointerMove(event);

		const _keyboardController = new KeyboardController({
			KeyW: moveForward,
			KeyS: moveBackward,
			KeyA: moveLeft,
			KeyD: moveRight,
			ArrowUp: moveForward,
			ArrowDown: moveBackward,
			ArrowLeft: moveLeft,
			ArrowRight: moveRight,
			Space: moveUp,
			ShiftLeft: moveDown,
		}, { mode: 'sync' });

		_keyboardController.stop();

		const _pointerLockController = new PointerLockController(targetElement, {
			locked: () => {
				window.addEventListener('pointermove', handlePointerMove);

				_keyboardController.resume();
			},
			unlocked: () => {
				window.removeEventListener('pointermove', handlePointerMove);

				_keyboardController.stop();
			},
		});

		const _trackPosition = Vector3.clone(camera.position);
		const _trackTarget = Vector3.clone(camera.target);
		const _trackRight = Vector3.clone(camera.right);
		const _trackUp = Vector3.clone(camera.up);
		const _trackForward = Vector3.clone(camera.forward);

		const directionToTarget = Vector3.direction(camera.position, camera.target);

		const _minOrientation = new Spherical(camera.nearPlane, Number.NEGATIVE_INFINITY, -PI_OVER_TWO + Number.EPSILON);
		const _maxOrientation = new Spherical(camera.farPlane, Number.POSITIVE_INFINITY, PI_OVER_TWO - Number.EPSILON);
		const _currentOrientation = Spherical.fromVector(directionToTarget);
		const _targetOrientation = Spherical.fromVector(directionToTarget);

		this.pointerSpeed = 0.005;
		this.trackingSpeed = 0.025;
		this.dampingFactor = 0.1;

		defineReadOnlyProperties(this, {
			// @ts-expect-error Object literal may only specify known properties, and '_keyboardController' does not exist in type 'Record<keyof this, unknown>'.
			_keyboardController,
			_pointerLockController,
			_trackPosition,
			_trackTarget,
			_trackRight,
			_trackUp,
			_trackForward,
			_minOrientation,
			_maxOrientation,
			_currentOrientation,
			_targetOrientation,
		});
	}

	get yawAngle() {
		return this._currentOrientation.theta;
	}

	get minYawAngle() {
		return this._minOrientation.theta;
	}

	get maxYawAngle() {
		return this._maxOrientation.theta;
	}

	get pitchAngle() {
		return this._currentOrientation.phi;
	}

	get minPitchAngle() {
		return this._minOrientation.phi;
	}

	get maxPitchAngle() {
		return this._maxOrientation.phi;
	}

	set yawAngle(value: number) {
		this._targetOrientation.theta = value;

		this._clampOrientation(this._targetOrientation);
	}

	set minYawAngle(value: number) {
		this._minOrientation.theta = value;
	}

	set maxYawAngle(value: number) {
		this._maxOrientation.theta = value;
	}

	set pitchAngle(value: number) {
		this._targetOrientation.phi = value;

		this._clampOrientation(this._targetOrientation);
	}

	set minPitchAngle(value: number) {
		this._minOrientation.phi = value;
	}

	set maxPitchAngle(value: number) {
		this._maxOrientation.phi = value;
	}

	private _clampOrientation(orientation: Spherical) {
		orientation.clamp(this._minOrientation, this._maxOrientation);
	}

	private _handlePointerMove(event: PointerEvent) {
		const { movementX, movementY } = event;

		this._targetOrientation.theta -= this.pointerSpeed * movementX;
		this._targetOrientation.phi += this.pointerSpeed * movementY;

		this._clampOrientation(this._targetOrientation);
	}

	setYawAngle(angle: number) {
		this.yawAngle = angle;

		return this;
	}

	setMinYawAngle(angle: number) {
		this.minYawAngle = angle;

		return this;
	}

	setMaxYawAngle(angle: number) {
		this.maxYawAngle = angle;

		return this;
	}

	setPitchAngle(angle: number) {
		this.pitchAngle = angle;

		return this;
	}

	setMinPitchAngle(angle: number) {
		this.minPitchAngle = angle;

		return this;
	}

	setMaxPitchAngle(angle: number) {
		this.maxPitchAngle = angle;

		return this;
	}

	setPointerSpeed(speed: number) {
		this.pointerSpeed = speed;

		return this;
	}

	setTrackingSpeed(speed: number) {
		this.trackingSpeed = speed;

		return this;
	}

	setDampingFactor(factor: number) {
		this.dampingFactor = factor;

		return this;
	}

	track(deltaX: number, deltaY: number, deltaZ: number) {
		const {
            _trackRight,
            _trackUp,
            _trackForward,
            _trackPosition,
            _trackTarget,
            trackingSpeed,
            camera
        } = this;

		_trackForward.copy(camera.forward).projectOnPlane(Camera.DEFAULT_UP).normalize();
		_trackRight.copy(Camera.DEFAULT_UP).cross(_trackForward).normalize();
		_trackUp.copy(_trackForward).cross(_trackRight).normalize();

		_trackRight.scale(trackingSpeed * deltaX);
		_trackUp.scale(trackingSpeed * deltaY);
		_trackForward.scale(trackingSpeed * deltaZ);

		const trackDirection = _trackRight.add(_trackUp).add(_trackForward);

		_trackPosition.add(trackDirection);
		_trackTarget.add(trackDirection);

		return this;
	}

	update() {
		const { position, target, forward } = this.camera;

		position.lerp(this._trackPosition, this.dampingFactor);
		target.lerp(this._trackTarget, this.dampingFactor);

		this._keyboardController.dispatch();

		this._currentOrientation.lerp(this._targetOrientation, this.dampingFactor);

		forward.setFromSpherical(this._currentOrientation);
		target.copy(position).add(forward);
	}

	override dispose() {
		super.dispose();

		this._keyboardController.dispose();
		this._pointerLockController.dispose();
	}
}

export default FirstPersonControls;
