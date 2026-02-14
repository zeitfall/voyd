import InputActionState from './InputActionState';

import { InputControlType } from '~/enums';

class InputActionDiscreteState extends InputActionState<InputControlType.DISCRETE> {

    constructor() {
        super(InputControlType.DISCRETE);
    }
}

export default InputActionDiscreteState;
