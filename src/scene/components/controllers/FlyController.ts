import SceneComponent from '../SceneComponent';

import { Vector3 } from '~/math';
import {
    InputManager,
    InputAction,
    InputSingleBinding,
    InputAxis3DBinding,
    InputVectorNormalizeProcessor,
    InputVectorScaleProcessor,
    InputVector2InvertProcessor
} from '~/input';

import { InputDeviceType, InputControlType, MouseButton } from '~/enums';

import type SceneNode from '../../SceneNode';

class FlyController extends SceneComponent {
    #inputAction: InputAction<InputControlType.VECTOR_3>;
    #desiredPosition: Vector3;

    constructor() {
        super();

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

        const pointerInputInvertProcessor = new InputVector2InvertProcessor(true, false);

        const inputMouseBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: MouseButton.LMB });
        const inputTouchBinding = new InputSingleBinding({ deviceType: InputDeviceType.POINTER, key: 'Touch1' });

        inputMouseBinding.processors.add(pointerInputInvertProcessor);
        inputTouchBinding.processors.add(pointerInputInvertProcessor);

        inputAction.bindings.add(inputKeyboardBinding);
        inputAction.bindings.add(inputMouseBinding);
        inputAction.bindings.add(inputTouchBinding);
        inputAction.processors.add(new InputVectorNormalizeProcessor());
        inputAction.processors.add(new InputVectorScaleProcessor(0.125));

        InputManager.addAction(inputAction);

        this.#inputAction = inputAction;
        this.#desiredPosition = new Vector3();
    }

    override attachTo(node: SceneNode) {
        super.attachTo(node);

        this.#desiredPosition.copy(node.transform.position);

        return this;
    }

    override detach() {
        super.detach();

        this.#desiredPosition.reset();
    }

    update(deltaTime: number) {
        const node = this.node;

        if (!node) {
            return;
        }

        const inputActionValue = this.#inputAction.value;

        const desiredPosition = this.#desiredPosition;

        if (inputActionValue.lengthSquared > 0) {
            desiredPosition.add(inputActionValue);
        }

        node.transform.position.damp(desiredPosition, 16, deltaTime);
    }
}

export default FlyController;
