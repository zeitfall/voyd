import { clamp } from '~/utils';

import type { InputProcessor } from '~/types';

class InputNumberClampProcessor implements InputProcessor<number> {
    #min: number;
    #max: number;

    constructor(min = 0, max = 1) {
        this.#min = min;
        this.#max = max;
    }

    process(value: number) {
        return clamp(value, this.#min, this.#max);
    }
}

export default InputNumberClampProcessor;
