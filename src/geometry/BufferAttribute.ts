import {
    VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP,
    VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

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

    get itemCount() {
        return this.#array.byteLength / this.bytesPerItem;
    }

    get componentsPerItem() {
        return VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[this.#format];
    }

    get bytesPerItem() {
        return VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[this.#format];
    }

    get bytesPerComponent() {
        const format = this.#format;

        if (format === 'unorm10-10-10-2') {
            throw new Error(`[BufferAttribute]: Format "${format}" is packed and does not have component byte size.`);
        }

        return VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP[format];
    }
}

export default BufferAttribute;
