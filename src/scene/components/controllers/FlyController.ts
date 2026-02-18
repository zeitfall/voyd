import SceneComponent from '../SceneComponent';

import { Vector3 } from '~/math';
import {
    InputManager,
    InputAction,
    InputSingleBinding,
    InputAxis3DBinding,
    InputVectorNormalizeProcessor,
    InputVector2InvertProcessor
} from '~/input';

import { InputDeviceType, InputControlType, MouseButton } from '~/enums';

import type SceneNode from '../../SceneNode';

class FlyController extends SceneComponent {
    #inputAction: InputAction<InputControlType.VECTOR_3>;

    #tempMovement: Vector3;
    #tempNodeRight: Vector3;
    #tempNodeForward: Vector3;
    #desiredPosition: Vector3;

    constructor() {
        super();

        this.#inputAction = this.#setupInputAction();

        this.#tempMovement = new Vector3();
        this.#tempNodeRight = new Vector3();
        this.#tempNodeForward = new Vector3();
        this.#desiredPosition = new Vector3();
    }

    override attachTo(node: SceneNode) {
        super.attachTo(node);

        const nodeTransform = node.transform;

        nodeTransform.extractRight(this.#tempNodeRight);
        nodeTransform.extractForward(this.#tempNodeForward);
        this.#desiredPosition.copy(nodeTransform.position);

        return this;
    }

    override detach() {
        super.detach();

        this.#tempMovement.reset();
        this.#tempNodeRight.reset();
        this.#tempNodeForward.reset();
        this.#desiredPosition.reset();
    }

    update(deltaTime: number) {
        const node = this.node;

        if (!node) {
            return;
        }

        const nodeTransform = node.transform;
        const nodePosition = nodeTransform.position;

        const inputActionValue = this.#inputAction.value;

        const desiredPosition = this.#desiredPosition;

        if (inputActionValue.lengthSquared > 0) {
            const movementX = inputActionValue.x;
            const movementY = inputActionValue.y;
            const movementZ = inputActionValue.z;

            const tempMovement = this.#tempMovement;
            const tempNodeRight = this.#tempNodeRight;
            const tempNodeForward = this.#tempNodeForward;

            nodeTransform.extractRight(tempNodeRight);
            nodeTransform.extractForward(tempNodeForward);

            tempNodeRight.setY(0).normalize().scale(movementX);
            tempNodeForward.setY(0).normalize().scale(movementZ);

            tempMovement
                .copy(Vector3.UP).scale(movementY)
                .add(tempNodeRight)
                .add(tempNodeForward);

            if (tempMovement.lengthSquared > 1) {
                tempMovement.normalize();
            }

            tempMovement.scale(8 * deltaTime);

            desiredPosition.add(tempMovement);
        }

        nodePosition.damp(desiredPosition, 16, deltaTime);
    }

    #setupInputAction() {
        const inputAction = new InputAction('_FlyController', InputControlType.VECTOR_3);

        const inputKeyboardBinding = new InputAxis3DBinding({
            left: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyA' },
                { deviceType: InputDeviceType.KEYBOARD, key: 'ArrowLeft' }
            ],
            right: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyD' },
                { deviceType: InputDeviceType.KEYBOARD, key: 'ArrowRight' }           
            ],
            up: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'Space' }
            ],
            down: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'ShiftLeft' },
                { deviceType: InputDeviceType.KEYBOARD, key: 'ShiftRight' }
            ],
            forward: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyW' },
                { deviceType: InputDeviceType.KEYBOARD, key: 'ArrowUp' }
            ],
            backward: [
                { deviceType: InputDeviceType.KEYBOARD, key: 'KeyS' },
                { deviceType: InputDeviceType.KEYBOARD, key: 'ArrowDown' }
            ]
        });

        const inputMouseBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: MouseButton.LMB });
        const inputTouchBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: 'Touch1' });

        const pointerInputInvertProcessor = new InputVector2InvertProcessor(true, false);
        const keyboardInputVectorNormalizeProcessor = new InputVectorNormalizeProcessor();

        inputKeyboardBinding.processors.add(keyboardInputVectorNormalizeProcessor);
        inputMouseBinding.processors.add(pointerInputInvertProcessor);
        inputTouchBinding.processors.add(pointerInputInvertProcessor);

        inputAction.bindings.add(inputKeyboardBinding);
        inputAction.bindings.add(inputMouseBinding);
        inputAction.bindings.add(inputTouchBinding);

        InputManager.addAction(inputAction);

        return inputAction;
    }
}

export default FlyController;
