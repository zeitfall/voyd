import AnyInputAction from './AnyInputAction';
import ScalarInputAction from './ScalarInputAction';
import Vector2InputAction from './Vector2InputAction';

import { InputActionValueType } from '~/enums';

class InputActionFactory {

    static createAction(name: string, valueType: InputActionValueType.ANY): AnyInputAction;
    static createAction(name: string, valueType: InputActionValueType.SCALAR): ScalarInputAction;
    static createAction(name: string, valueType: InputActionValueType.VECTOR_2): Vector2InputAction;
    static createAction(name: string, valueType: unknown): unknown {
        switch (valueType) {
            case InputActionValueType.ANY:
                return new AnyInputAction(name, undefined);

            case InputActionValueType.SCALAR:
                return new ScalarInputAction(name, 0);

            case InputActionValueType.VECTOR_2:
                return new Vector2InputAction(name);

            default:
                throw new Error(`[InputAction]: Unsupported value type. "${valueType}" was given.`);
        }
    }
}

export default InputActionFactory;
