import { createVertexBufferView } from '~/utils';

import {
    VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

import type { BufferView, VertexBufferViewMap } from '~/types';

class StandardBufferView<F extends GPUVertexFormat> implements BufferView {
    #buffer: ArrayBuffer;
    #byteStride: number;
    #layout: Readonly<[GPUVertexFormat]>;

    #view: VertexBufferViewMap[F];
    #componentsPerElement: number;

    constructor(buffer: ArrayBuffer, format: F) {
        const bufferByteLength = buffer.byteLength;
        const byteStride = VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[format];

        if (bufferByteLength % byteStride !== 0) {
            throw new Error(`[StandardBufferView]: Buffer byte length must be a multiple of byte stride.`);
        }

        this.#buffer = buffer;
        this.#byteStride = byteStride;
        this.#layout = Object.freeze([format]);

        this.#view = createVertexBufferView(format, buffer);
        this.#componentsPerElement = VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[format];
    }

    get buffer() {
        return this.#buffer;
    }

    get byteStride() {
        return this.#byteStride;
    }

    get layout() {
        return this.#layout;
    }

    get(index: number, componentIndex: number) {
        const viewIndex = this.#calculateViewIndex(index, componentIndex);

        return this.#view[viewIndex];
    }

    set(index: number, componentIndex: number, value: number) {
        const viewIndex = this.#calculateViewIndex(index, componentIndex);

        this.#view[viewIndex] = value;

        return this;
    }

    #calculateViewIndex(index: number, componentIndex: number) {
        return index * this.#componentsPerElement + componentIndex;
    }
}

export default StandardBufferView;
