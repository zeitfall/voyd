import { createVertexBufferView } from '~/utils';

import {
    VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

import type { BufferAttribute, VertexBufferViewMap } from '~/types';

class StandardBufferAttribute<F extends GPUVertexFormat> implements BufferAttribute {
    #data: ArrayBuffer;
    #byteStride: number;
    #layout: Readonly<[GPUVertexFormat]>;

    #view: VertexBufferViewMap[F];
    #componentsPerElement: number;

    constructor(data: ArrayBuffer, format: F) {
        const dataByteLength = data.byteLength;
        const byteStride = VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[format];

        if (dataByteLength % byteStride !== 0) {
            throw new Error(`[StandardBufferAttribute]: Data byte length must be a multiple of byte stride.`);
        }

        this.#data = data;
        this.#byteStride = byteStride;
        this.#layout = Object.freeze([format]);

        this.#view = createVertexBufferView(format, data);
        this.#componentsPerElement = VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[format];
    }

    get data() {
        return this.#data;
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

export default StandardBufferAttribute;
