function createBufferFromData(device: GPUDevice, data: BufferSource, usage: number) {
    const bufferSize = 4 * Math.ceil(data.byteLength / 4);
    const buffer = device.createBuffer({ size: bufferSize, usage, mappedAtCreation: true });

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

function createUniformBuffer(device: GPUDevice, data: BufferSource, usage = 0) {
    return createBufferFromData(device, data, GPUBufferUsage.UNIFORM | usage);
}

function createStorageBuffer(device: GPUDevice, data: BufferSource, usage = 0) {
    return createBufferFromData(device, data, GPUBufferUsage.STORAGE | usage);
}

function createVertexBuffer(device: GPUDevice, data: BufferSource, usage = 0) {
    return createBufferFromData(device, data, GPUBufferUsage.VERTEX | usage);
}

function createIndexBuffer(device: GPUDevice, data: BufferSource, usage = 0) {
    return createBufferFromData(device, data, GPUBufferUsage.INDEX | usage);
}

export {
    createBufferFromData,
    createUniformBuffer,
    createStorageBuffer,
    createVertexBuffer,
    createIndexBuffer
};
