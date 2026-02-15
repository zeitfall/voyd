import type { Vector } from '~/math';
import type { InputProcessor } from '~/types';

// NOTE: Might be a good idea to create InputScaleProcessor,
// since it shares the same constructor with InputNumberScaleProcessor.
class InputVectorScaleProcessor implements InputProcessor<Vector> {
    #scaleFactor: number;

    constructor(scaleFactor: number) {
        this.#scaleFactor = scaleFactor;
    }

    process(value: Vector) {
        return value.scale(this.#scaleFactor);
    }
}

export default InputVectorScaleProcessor;
