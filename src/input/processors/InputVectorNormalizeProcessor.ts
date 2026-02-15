import type { Vector } from '~/math';
import type { InputProcessor } from '~/types';

class InputVectorNormalizeProcessor implements InputProcessor<Vector> {

    process(value: Vector) {
        return value.normalize();
    }
}

export default InputVectorNormalizeProcessor;
