import { createVertexBufferView } from '~/utils';

import { VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

import type { BufferAttribute, VertexBufferViewMap } from '~/types';

class InterleavedBufferAttribute implements BufferAttribute {
    #data: ArrayBuffer;
    #byteStride: number;
    #layout: Readonly<GPUVertexFormat[]>;

    #views: Array<VertexBufferViewMap[GPUVertexFormat]>;
    #attributeByteOffsets: Uint32Array;

    constructor(data: ArrayBuffer, layout: GPUVertexFormat[]) {
        const formatCount = layout.length;

        const views = new Array(formatCount);
        const viewMap = new Map();
        const attributeByteOffsets = new Uint32Array(formatCount);

        let currentAttributeOffset = 0;

        for (let i = 0; i < formatCount; i++) {
            const format = layout[i];

            if (format === 'unorm10-10-10-2') {
                throw new Error(`[InterleavedBufferAttribute]: Format "${format}" is packed and does not have a byte size per component.`);
            }

            let view = viewMap.get(format);

            if (!view) {
                view = createVertexBufferView(format, data);

                viewMap.set(format, view);
            }

            views[i] = view;
            attributeByteOffsets[i] = currentAttributeOffset;

            currentAttributeOffset += VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[format];
        }

        const dataByteLength = data.byteLength;
        const byteStride = currentAttributeOffset;

        if (dataByteLength % byteStride !== 0) {
            throw new Error(`[InterleavedBufferAttribute]: Data byte length must be a multiple of byte stride.`);
        }

        this.#data = data;
        this.#layout = Object.freeze(layout);
        this.#byteStride = byteStride;

        this.#views = views;
        this.#attributeByteOffsets = attributeByteOffsets;
    }

    get data() {
        return this.#data;
    }

    get layout() {
        return this.#layout;
    }

    get byteStride() {
        return this.#byteStride;
    }

    get(index: number, attributeIndex: number, componentIndex: number) {
        const view = this.#views[attributeIndex];
        const viewIndex = this.#calculateViewIndex(index, attributeIndex, componentIndex, view.BYTES_PER_ELEMENT);

        return view[viewIndex];
    }

    set(index: number, attributeIndex: number, componentIndex: number, value: number) {
        const view = this.#views[attributeIndex];
        const viewIndex = this.#calculateViewIndex(index, attributeIndex, componentIndex, view.BYTES_PER_ELEMENT);

        view[viewIndex] = value;

        return this;
    }

    #calculateViewIndex(index: number, attributeIndex: number, componentIndex: number, bytesPerElement: number) {
        const attributeByteOffset = this.#attributeByteOffsets[attributeIndex];
        const attributeByteStart = index * this.byteStride + attributeByteOffset;

        return (attributeByteStart / bytesPerElement) + componentIndex;
    }
}

export default InterleavedBufferAttribute;
