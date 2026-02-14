import InputActionState from './InputActionState';

import { InputControlType } from '~/enums';

class InputActionAxisState extends InputActionState<InputControlType.AXIS> {

    constructor() {
        super(InputControlType.AXIS);
    }
}

export default InputActionAxisState;
