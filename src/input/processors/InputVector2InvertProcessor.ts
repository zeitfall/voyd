import type { Vector2 } from '~/math';
import type { InputProcessor } from '~/types';

class InputVector2InvertProcessor implements InputProcessor<Vector2> {
    #invertX: boolean;
    #invertY: boolean;

    constructor(invertX: boolean, invertY: boolean) {
        this.#invertX = invertX;
        this.#invertY = invertY;
    }

    process(value: Vector2) {
        const scaleX = this.#invertX ? -1 : 1;
        const scaleY = this.#invertY ? -1 : 1;

        return value.scale(scaleX, scaleY);
    }
}

export default InputVector2InvertProcessor;
