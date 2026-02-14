import InputActionState from './InputActionState';

import { InputControlType } from '~/enums';

class InputActionContinuousState extends InputActionState<InputControlType.CONTINUOUS> {

    constructor() {
        super(InputControlType.CONTINUOUS);
    }
}

export default InputActionContinuousState;
