import { createVertexView } from '~/utils';

import {
    VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

import type InterleavedBuffer from './InterleavedBuffer';
import type { VertexViewMap } from '~/types';

class InterleavedBufferAttribute<F extends GPUVertexFormat> {
    #buffer: InterleavedBuffer;
    #bufferView: VertexViewMap[F];
    #format: GPUVertexFormat;
    #byteOffset: number;

    constructor(buffer: InterleavedBuffer, format: F, byteOffset = 0) {
        this.#buffer = buffer;
        this.#bufferView = createVertexView(format, buffer.data);
        this.#format = format;
        this.#byteOffset = byteOffset;
    }

    get format() {
        return this.#format;
    }

    get byteOffset() {
        return this.#byteOffset;
    }

    get bytesPerComponent() {
        const format = this.format;

        if (format === 'unorm10-10-10-2') {
            throw new Error(`[InterleavedBufferAttribute]: Format "${format}" is packed and does not have a byte size per component.`);
        }

        return VERTEX_ATTRIBUTE_COMPONENT_BYTE_SIZE_MAP[format];
    }

    get byteSize() {
        return VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[this.format];
    }

    get(index: number, componentIndex: number) {
        const componentByteOffset = this.#calculateComponentByteOffset(index, componentIndex);

        switch (this.bytesPerComponent) {
            case 1:
                return this.#bufferView[componentByteOffset];
    
            case 2:
                return this.#bufferView[componentByteOffset / 2]; 

            case 4:
                return this.#bufferView[componentByteOffset / 4];

            default:
                throw new Error(`[InterleavedBufferAttribute]: Unsupported format "${this.format}" was given.`);
        }
    }

    set(index: number, componentIndex: number, value: number) {
        const componentByteOffset = this.#calculateComponentByteOffset(index, componentIndex);

        switch (this.bytesPerComponent) {
            case 1:
                this.#bufferView[componentByteOffset] = value;

                break;
    
            case 2:
                this.#bufferView[componentByteOffset / 2] = value;

                break;

            case 4:
                this.#bufferView[componentByteOffset / 4] = value;

                break;

            default:
                throw new Error(`[InterleavedBufferAttribute]: Unsupported format "${this.format}" was given.`);
        }
    }

    #calculateComponentByteOffset(index: number, componentIndex: number) {
        return this.byteOffset
            + index * this.#buffer.byteStride
            + componentIndex * this.bytesPerComponent;
    }
}

export default InterleavedBufferAttribute;
