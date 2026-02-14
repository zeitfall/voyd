import InputActionState from './InputActionState';

import { InputControlType } from '~/enums';

class InputActionVector2State extends InputActionState<InputControlType.VECTOR_2> {

    constructor() {
        super(InputControlType.VECTOR_2);
    }
}

export default InputActionVector2State;
