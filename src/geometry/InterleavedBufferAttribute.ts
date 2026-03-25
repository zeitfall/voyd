import BufferAttribute from './BufferAttribute';

import type { VertexBufferViewMap } from './types';

class InterleavedBufferAttribute<F extends GPUVertexFormat = GPUVertexFormat> extends BufferAttribute<F> {
    #itemCount: number;
    #byteOffset: number;
    #byteStride: number;
    #elementOffset: number;
    #elementStride: number;

    constructor(format: F, array: VertexBufferViewMap[F], byteOffset: number, byteStride: number) {
        super(format, array);

        const bytesPerArrayElement = array.BYTES_PER_ELEMENT;

        this.#itemCount = array.byteLength / byteStride;
        this.#byteOffset = byteOffset;
        this.#byteStride = byteStride;
        this.#elementOffset = Math.floor(byteOffset / bytesPerArrayElement);
        this.#elementStride = Math.floor(byteStride / bytesPerArrayElement);
    }

    get itemCount() {
        return this.#itemCount;
    }

    get byteStride() {
        return this.#byteStride;
    }

    get byteOffset() {
        return this.#byteOffset;
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
        return index * this.#elementStride + this.#elementOffset + componentIndex;
    }
}

export default InterleavedBufferAttribute;
