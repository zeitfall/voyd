import {
    VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP,
    VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

import type { VertexBufferViewMap } from '~/types';

abstract class BufferAttribute<F extends GPUVertexFormat = GPUVertexFormat> {
    #format: F;
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

    get componentsPerItem() {
        return VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[this.#format];
    }

    get bytesPerItem() {
        return VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[this.#format];
    }

    abstract get itemCount(): number;

    get bytesPerComponent() {
        const format = this.#format;

        if (format === 'unorm10-10-10-2') {
            throw new Error(`[BufferAttribute]: Format "${format}" is packed and does not have a byte size per component`);
        }

        // @ts-expect-error Type 'F' cannot be used to index type 'VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP'.
        return VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP[format];
    }

    abstract get(index: number, componentIndex: number): number;

    abstract set(index: number, componentIndex: number, value: number): this;
}

export default BufferAttribute;
