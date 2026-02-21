import { GPUContext } from '~/core';

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

export {
    createBuffer,
    createBufferFromData,
    createUniformBuffer,
    createStorageBuffer,
    createVertexBuffer,
    createIndexBuffer
};
