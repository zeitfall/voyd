import type { InputProcessor } from '~/types';

class InputBinding {
    #processors: Set<InputProcessor>;

    constructor() {
        this.#processors = new Set();        
    }

    get processors() {
        return this.#processors;
    }
}

export default InputBinding;
