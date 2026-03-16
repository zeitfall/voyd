import { remap } from '~/utils';

import type { InputProcessor } from '~/types';

class InputNumberRemapProcessor implements InputProcessor<number> {
    #oldMin: number;
    #oldMax: number;
    #newMin: number;
    #newMax: number;

    constructor(oldMin: number, oldMax: number, newMin: number, newMax: number) {
        this.#oldMin = oldMin;
        this.#oldMax = oldMax;
        this.#newMin = newMin;
        this.#newMax = newMax;
    }

    process(value: number) {
        return remap(value, this.#oldMin, this.#oldMax, this.#newMin, this.#newMax);
    }
}

export default InputNumberRemapProcessor;