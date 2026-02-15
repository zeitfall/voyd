import type { Vector3 } from '~/math';
import type { InputProcessor } from '~/types';

class InputVector3InvertProcessor implements InputProcessor<Vector3> {
    #invertX: boolean;
    #invertY: boolean;
    #invertZ: boolean;

    constructor(invertX: boolean, invertY: boolean, invertZ: boolean) {
        this.#invertX = invertX;
        this.#invertY = invertY;
        this.#invertZ = invertZ;
    }

    process(value: Vector3) {
        const scaleX = this.#invertX ? -1 : 1;
        const scaleY = this.#invertY ? -1 : 1;
        const scaleZ = this.#invertZ ? -1 : 1;

        return value.scale(scaleX, scaleY, scaleZ);
    }
}

export default InputVector3InvertProcessor;
