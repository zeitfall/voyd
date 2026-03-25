import { remap } from '~/math';

import type { InputProcessor } from '../types';

class InputNumberNormalizeProcessor implements InputProcessor<number> {
    #rawMin: number;
    #rawMax: number;
    #zero: number;

    constructor(rawMin: number, rawMax: number, zero = 0) {
        this.#rawMin = rawMin;
        this.#rawMax = rawMax;
        this.#zero = zero;
    }

    process(value: number) {
        const rawMin = this.#rawMin;
        const rawMax = this.#rawMax;
        const zero = this.#zero;

        if (rawMin < zero) {
            return remap(value, rawMin, rawMax, -1, 1);
        }

        return remap(value, rawMin, rawMax, 0, 1);
    }
}

export default InputNumberNormalizeProcessor;