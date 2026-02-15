import { remap } from '~/utils';

import type { InputProcessor } from '~/types';

class InputNumberNormalizeProcessor implements InputProcessor<number> {
    #rawMin: number;
    #rawMax: number;

    constructor(rawMin: number, rawMax: number) {
        this.#rawMin = rawMin;
        this.#rawMax = rawMax;
    }

    process(value: number) {
        return remap(value, this.#rawMin, this.#rawMax, 0, 1);
    }
}

export default InputNumberNormalizeProcessor;