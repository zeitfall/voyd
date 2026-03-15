import BufferAttribute from './BufferAttribute';

import type { VertexBufferViewMap } from '~/types';

class StandardBufferAttribute<F extends GPUVertexFormat = GPUVertexFormat> extends BufferAttribute<F> {
    #itemCount: number;

    constructor(format: F, array: VertexBufferViewMap[F]) {
        super(format, array);

        this.#itemCount = array.byteLength / this.bytesPerItem;
    }

    get itemCount() {
        return this.#itemCount;
    }

    get(index: number, componentIndex: number) {
        const arrayIndex = this.#calculateArrayIndex(index, componentIndex);

        return this.array[arrayIndex];
    }

    set(index: number, componentIndex: number, value: number) {
        const arrayIndex = this.#calculateArrayIndex(index, componentIndex);

        this.array[arrayIndex] = value;

        return this;
    }

    #calculateArrayIndex(index: number, componentIndex: number) {
        return index * this.componentsPerItem + componentIndex;
    }
}

export default StandardBufferAttribute;
