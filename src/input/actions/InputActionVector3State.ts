import InputActionState from './InputActionState';

import { InputControlType } from '~/enums';

class InputActionVector3State extends InputActionState<InputControlType.VECTOR_3> {

    constructor() {
        super(InputControlType.VECTOR_3);
    }
}

export default InputActionVector3State;
