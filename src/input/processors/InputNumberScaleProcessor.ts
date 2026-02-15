import type { InputProcessor } from '~/types';

// NOTE: Might be a good idea to create InputScaleProcessor,
// since it shares the same constructor with InputVectorScaleProcessor.
class InputNumberScaleProcessor implements InputProcessor<number> {
    #scaleFactor: number;

    constructor(scaleFactor: number) {
        this.#scaleFactor = scaleFactor;
    }

    process(value: number) {
        return this.#scaleFactor * value;
    }
}

export default InputNumberScaleProcessor;
