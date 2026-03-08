import { GPUContext } from '~/core';

import {
    VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP,
    VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP
} from '~/constants';

import type { BufferAttribute } from '~/geometry';
import type {
    Constructor,
    TypedArray,
    VertexBufferViewMap
} from '~/types';

function createBuffer(size: number, usage: number, mappedAtCreation = false) {
    return GPUContext.device.createBuffer({
        size,
        usage,
        mappedAtCreation 
    });
}

function createBufferFromData(data: BufferSource, usage: number) {
    const alignedSize = 4 * Math.ceil(data.byteLength / 4);

    const buffer = createBuffer(alignedSize, usage, true);

    const mappedRange = buffer.getMappedRange();
    const mappedRangeView = new Uint8Array(mappedRange);

    if (ArrayBuffer.isView(data)) {
        mappedRangeView.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    }
    else {
        mappedRangeView.set(new Uint8Array(data));
    }

    buffer.unmap();

    return buffer;
}

function createUniformBuffer(data: BufferSource, usage = 0) {
    return createBufferFromData(data, GPUBufferUsage.UNIFORM | usage);
}

function createStorageBuffer(data: BufferSource, usage = 0) {
    return createBufferFromData(data, GPUBufferUsage.STORAGE | usage);
}

function createVertexBuffer(data: BufferSource, usage = 0) {
    return createBufferFromData(data, GPUBufferUsage.VERTEX | usage);
}

function createIndexBuffer(data: BufferSource, usage = 0) {
    return createBufferFromData(data, GPUBufferUsage.INDEX | usage);
}

function createVertexBufferView<F extends GPUVertexFormat>(format: F, buffer?: ArrayBuffer, byteOffset?: number) {
    switch (format) {
        case 'uint8':
        case 'uint8x2':
        case 'uint8x4':
        case 'unorm8':
        case 'unorm8x2':
        case 'unorm8x4':
        case 'unorm8x4-bgra':
            return _instantiateTypedArray(Uint8Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'uint16':
        case 'uint16x2':
        case 'uint16x4':
        case 'unorm16':
        case 'unorm16x2':
        case 'unorm16x4':
            return _instantiateTypedArray(Uint16Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'uint32':
        case 'uint32x2':
        case 'uint32x3':
        case 'uint32x4':
            return _instantiateTypedArray(Uint32Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'sint8':
        case 'sint8x2':
        case 'sint8x4':
        case 'snorm8':
        case 'snorm8x2':
        case 'snorm8x4':
            return _instantiateTypedArray(Int8Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'sint16':
        case 'sint16x2':
        case 'sint16x4':
        case 'snorm16':
        case 'snorm16x2':
        case 'snorm16x4':
            return _instantiateTypedArray(Int16Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'sint32':
        case 'sint32x2':
        case 'sint32x3':
        case 'sint32x4':
            return _instantiateTypedArray(Int32Array, buffer, byteOffset) as VertexBufferViewMap[F];
        
        case 'float16':
        case 'float16x2':
        case 'float16x4':
            return _instantiateTypedArray(Float16Array, buffer, byteOffset) as VertexBufferViewMap[F];

        case 'float32':
        case 'float32x2':
        case 'float32x3':
        case 'float32x4':
            return _instantiateTypedArray(Float32Array, buffer, byteOffset) as VertexBufferViewMap[F];

        default:
            throw new Error(`Unsupported format "${format}" was given.`);
    }
}

function interleaveBufferAttributes(attributes: BufferAttribute[]) {
    let vertexCount = 0;
    let bytesPerVertex = 0;

    const attributeCount = attributes.length;
    const attributeComponentCounts = new Array(attributeCount);
    const attributeByteOffsets = new Array(attributeCount);
    const attributeViews = new Array(attributeCount);
    const attributeViewMap = new Map();

    for (let i = 0; i < attributeCount; i++) {
        const attribute = attributes[i];
        const attributeFormat = attribute.format;
        const attributeArrayByteLength = attribute.array.byteLength;
        const attributeByteSize = VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[attributeFormat];

        attributeComponentCounts[i] = VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[attributeFormat];
        attributeByteOffsets[i] = bytesPerVertex;

        vertexCount = Math.max(vertexCount, attributeArrayByteLength / attributeByteSize);
        bytesPerVertex += attributeByteSize;
    }

    bytesPerVertex = 4 * Math.ceil(bytesPerVertex / 4);

    const buffer = new ArrayBuffer(vertexCount * bytesPerVertex);

    for (let i = 0; i < attributeCount; i++) {
        const attribute = attributes[i];
        const attributeFormat = attribute.format;
        let attributeView = attributeViewMap.get(attributeFormat);

        if (!attributeView) {
            attributeView = createVertexBufferView(attributeFormat, buffer);

            attributeViewMap.set(attributeFormat, attributeView);
        }

        attributeViews[i] = attributeView;
    }

    for (let i = 0; i < vertexCount; i++) {
        const vertexByteOffset = i * bytesPerVertex;

        for (let j = 0; j < attributeCount; j++) {
            const attributeArray = attributes[j].array;
            const attributeComponentCount = attributeComponentCounts[j];
            const attributeByteOffset = attributeByteOffsets[j];
            const attributeView = attributeViews[j];
            const attributeViewStartIndex = (vertexByteOffset + attributeByteOffset) / attributeView.BYTES_PER_ELEMENT;
            const attributeComponentStartIndex = i * attributeComponentCount;

            for (let k = 0; k < attributeComponentCount; k++) {
                attributeView[attributeViewStartIndex + k] = attributeArray[attributeComponentStartIndex + k];
            }
        }
    }

    return buffer;
}

function _instantiateTypedArray(
    Constructor: Constructor<TypedArray>,
    buffer?: ArrayBuffer,
    byteOffset = 0
) {
    if (buffer) {
        return new Constructor(buffer, byteOffset);
    }

    return new Constructor();
}

export {
    createBuffer,
    createBufferFromData,
    createUniformBuffer,
    createStorageBuffer,
    createVertexBuffer,
    createIndexBuffer,
    createVertexBufferView,
    interleaveBufferAttributes
};
