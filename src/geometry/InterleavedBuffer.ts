import InterleavedBufferAttribute from './InterleavedBufferAttribute';

import { createVertexBufferView } from './utils';

import type StandardBufferAttribute from './BufferAttribute';

class InterleavedBuffer {
    #data: ArrayBuffer;
    #attributes: ReadonlyArray<InterleavedBufferAttribute>;
    #layout: Readonly<GPUVertexBufferLayout>;

    constructor(attributes: StandardBufferAttribute[]) {
        const attributeCount = attributes.length;

        if (attributeCount <= 0) {
            throw new Error('[InterleavedBuffer]: At least 1 buffer attribute should be provided.');
        }

        const attributeByteOffsets = new Int32Array(attributeCount);
        const attributeBytesPerItems = new Int32Array(attributeCount);
        const attributeViews = new Array<Uint8Array>(attributeCount);
        const interleavedAttributes = new Array<InterleavedBufferAttribute>(attributeCount);
        
        let itemCount = attributes[0].itemCount;
        let byteStride = 0;

        for (let i = 0; i < attributeCount; i++) {
            const attribute = attributes[i];
            const attributeArray = attribute.array;
            const attributeItemCount = attribute.itemCount;
            const attributeBytesPerItem = attribute.bytesPerItem;

            if (attributeItemCount !== itemCount) {
                throw new Error(`[InterleavedBuffer]: Attribute at index "${i}" has an incompatible number of items. Expected "${itemCount}", but got "${attributeItemCount}".`);
            }

            byteStride = 4 * Math.ceil(byteStride / 4);

            attributeByteOffsets[i] = byteStride;
            attributeBytesPerItems[i] = attributeBytesPerItem;
            attributeViews[i] = new Uint8Array(attributeArray.buffer, attributeArray.byteOffset, attributeArray.byteLength);

            byteStride += attributeBytesPerItem;
        }

        byteStride = 4 * Math.ceil(byteStride / 4);

        const layoutAttributes = new Array<GPUVertexAttribute>(attributeCount);

        const bufferSize = itemCount * byteStride;
        const buffer = new ArrayBuffer(bufferSize);
        const bufferView = new Uint8Array(buffer);

        for (let i = 0; i < attributeCount; i++) {
            const attribute = attributes[i];
            const attributeFormat = attribute.format;
            const attributeByteOffset = attributeByteOffsets[i];
            const attributeBytesPerItem = attributeBytesPerItems[i];
            const attributeView = attributeViews[i];

            const interleavedAttributeArray = createVertexBufferView(attributeFormat, buffer);
            const interleavedAttribute = new InterleavedBufferAttribute(attributeFormat, interleavedAttributeArray, attributeByteOffset, byteStride);

            interleavedAttributes[i] = interleavedAttribute;

            layoutAttributes[i] = {
                shaderLocation: i,
                format: attributeFormat,
                offset: attributeByteOffset
            };

            for (let j = 0; j < itemCount; j++) {
                const itemByteStart = j * byteStride;
                const attributeViewByteStart = j * attributeBytesPerItem;
                const bufferViewByteStart = itemByteStart + attributeByteOffset;

                for (let k = 0; k < attributeBytesPerItem; k++) {
                    bufferView[bufferViewByteStart + k] = attributeView[attributeViewByteStart + k];
                }
            }
        }

        const layout: GPUVertexBufferLayout = {
            arrayStride: byteStride,
            stepMode: 'vertex',
            attributes: Object.freeze(layoutAttributes)
        };

        this.#data = buffer;
        this.#attributes = Object.freeze(interleavedAttributes);
        this.#layout = Object.freeze(layout);
    }

    get data() {
        return this.#data;
    }

    get attributes() {
        return this.#attributes;
    }

    get layout() {
        return this.#layout;
    }
}

export default InterleavedBuffer;
