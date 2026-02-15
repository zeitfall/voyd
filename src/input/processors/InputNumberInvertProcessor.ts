import InputNumberScaleProcessor from './InputNumberScaleProcessor';

class InputNumberInvertProcessor extends InputNumberScaleProcessor {

    constructor() {
        super(-1);
    }
}

export default InputNumberInvertProcessor;
