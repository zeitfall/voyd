import type { VertexBufferViewMap } from '~/types';

class BufferAttribute<F extends GPUVertexFormat = GPUVertexFormat> {
    #format: GPUVertexFormat;
    #array: VertexBufferViewMap[F];

    constructor(format: F, array: VertexBufferViewMap[F]) {
        this.#format = format;
        this.#array = array;
    }

    get format() {
        return this.#format;
    }

    get array() {
        return this.#array;
    }
}

export default BufferAttribute;
