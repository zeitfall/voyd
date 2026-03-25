import type { CommandBufferCallback, RenderBundleCallback } from './types';

function createCommandBuffer(device: GPUDevice, callback: CommandBufferCallback) {
    const encoder = device.createCommandEncoder();

    callback(encoder);

    return encoder.finish();
} 

function createRenderBundle(device: GPUDevice, callback: RenderBundleCallback, descriptor: GPURenderBundleEncoderDescriptor) {
    const encoder = device.createRenderBundleEncoder(descriptor);

    callback(encoder);

    return encoder.finish();
}

export {
    createCommandBuffer,
    createRenderBundle
};
