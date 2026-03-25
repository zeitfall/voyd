import { Vector3, Spherical, Quaternion } from '~/math';
import { SceneComponent, type SceneNode } from '~/scene';
import {
    InputManager,
    InputAction,
    InputSingleBinding,
    InputAxis2DBinding,
    InputVectorNormalizeProcessor,
    InputVectorScaleProcessor,
    InputVector2InvertProcessor,
    InputDeviceType,
    InputControlType,
    MouseButton 
} from '~/input';

import { clamp, damp, PI_OVER_TWO } from '~/math';

class FreeLookController extends SceneComponent {
    #inputAction: InputAction<InputControlType.VECTOR_2>;

    #yawQuaternion: Quaternion;
    #pitchQuaternion: Quaternion;

    #currentYawAngle: number;
    #targetYawAngle: number;
    minYawAngle: number;
    maxYawAngle: number;

    #currentPitchAngle: number;
    #targetPitchAngle: number;
    minPitchAngle: number;
    maxPitchAngle: number;

    #dampingFactor: number;
    #lookSpeed: number;

    constructor() {
        super();

        this.#inputAction = this.#setupInputAction();

        this.#yawQuaternion = new Quaternion();
        this.#pitchQuaternion = new Quaternion();

        this.#currentYawAngle = 0;
        this.#targetYawAngle = 0;
        this.minYawAngle = Number.NEGATIVE_INFINITY;
        this.maxYawAngle = Number.POSITIVE_INFINITY;

        this.#currentPitchAngle = 0;
        this.#targetPitchAngle = 0;
        this.minPitchAngle = -PI_OVER_TWO + Number.EPSILON;
        this.maxPitchAngle = PI_OVER_TWO - Number.EPSILON;

        this.#dampingFactor = 12;
        this.#lookSpeed = 12;
    }

    get yawAngle() {
        return this.#targetYawAngle;
    }

    set yawAngle(value: number) {
        this.#targetYawAngle = clamp(value, this.minYawAngle, this.maxYawAngle);
    }

    get pitchAngle() {
        return this.#targetPitchAngle;
    }

    set pitchAngle(value: number) {
        this.#targetPitchAngle = clamp(value, this.minPitchAngle, this.maxPitchAngle);
    }

    get dampingFactor() {
        return this.#dampingFactor;
    }

    set dampingFactor(value: number) {
        this.#dampingFactor = Math.max(0, value);
    }

    get lookSpeed() {
        return this.#lookSpeed;
    }

    set lookSpeed(value: number) {
        this.#lookSpeed = Math.max(0, value);
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

    setDampingFactor(value: number) {
        this.dampingFactor = value;

        return this;
    }

    setLookSpeed(value: number) {
        this.lookSpeed = value;

        return this;
    }

    override attachTo(node: SceneNode) {
        super.attachTo(node);

        const nodeForward = new Vector3();
        const nodeSphericalForward = new Spherical();

        node.transform.extractForward(nodeForward);
        nodeSphericalForward.setFromVector(nodeForward);

        this.#targetYawAngle = this.#currentYawAngle = nodeSphericalForward.theta;
        this.#targetPitchAngle = this.#currentPitchAngle = -nodeSphericalForward.phi;
    
        return this;
    }

    override detach() {
        super.detach();

        this.setYawAngle(0).setPitchAngle(0);

        this.#yawQuaternion.reset();
        this.#pitchQuaternion.reset();
    }

    update(deltaTime: number) {
        const node = this.node;

        if (!node) {
            return;
        }

        const inputActionValue = this.#inputAction.value;

        const yawQuaternion = this.#yawQuaternion;
        const pitchQuaternion = this.#pitchQuaternion;

        if (inputActionValue.lengthSquared > 0) {
            // TODO: Ideally, the input action value components must be multiplied by "deltaTime".
            // However, it should NOT be applied to pointer generated events.
            // Most likely, we need to update the state of the scale processor of the keyboard binding.
            this.yawAngle += inputActionValue.x;
            this.pitchAngle += inputActionValue.y;
        }

        let currentYawAngle = this.#currentYawAngle;
        let currentPitchAngle = this.#currentPitchAngle;

        currentYawAngle = damp(currentYawAngle, this.#targetYawAngle, 12, deltaTime);
        currentPitchAngle = damp(currentPitchAngle, this.#targetPitchAngle, 12, deltaTime);

        yawQuaternion.setFromAxisAngle(Vector3.UP, currentYawAngle);
        pitchQuaternion.setFromAxisAngle(Vector3.RIGHT, currentPitchAngle);

        this.#currentYawAngle = currentYawAngle;
        this.#currentPitchAngle = currentPitchAngle;

        node.transform.rotation
            .copy(yawQuaternion)
            .multiply(pitchQuaternion)
            .normalize();
    }

    #setupInputAction() {
        const inputActionID = Symbol('FreeLookController');
        const inputAction = new InputAction(inputActionID, InputControlType.VECTOR_2);

        const inputKeyboardBinding = new InputAxis2DBinding({
            left: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyQ' }
            ],
            right: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyE' }
            ],
            up: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyR' }
            ],
            down: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyF' }
            ]
        });

        const inputMouseBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: MouseButton.LMB });
        const inputTouchBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: 'TouchPan1' });

        const pointerInputScaleProcessor = new InputVectorScaleProcessor(0.005);

        inputKeyboardBinding.processors.add(new InputVector2InvertProcessor(false, true))
        inputKeyboardBinding.processors.add(new InputVectorNormalizeProcessor());
        inputKeyboardBinding.processors.add(new InputVectorScaleProcessor(0.025));
        inputMouseBinding.processors.add(pointerInputScaleProcessor);
        inputTouchBinding.processors.add(pointerInputScaleProcessor);

        inputAction.bindings.add(inputKeyboardBinding);
        inputAction.bindings.add(inputMouseBinding);
        inputAction.bindings.add(inputTouchBinding);

        InputManager.addAction(inputAction);

        return inputAction;
    }
}

export default FreeLookController;
