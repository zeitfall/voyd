import type { GPUContextConfig, GPUContext } from './types';

async function createGPUContext(config: Partial<GPUContextConfig> | null = null): Promise<GPUContext> {
    const gpu = navigator.gpu;

    if (!gpu) {
        throw new Error('WebGPU API is not supported by this browser.');
    }

    const adapter = await gpu.requestAdapter(config?.adapter);
    
    if (!adapter) {
        throw new Error('Failed to request the GPU adapter.');
    }

    const device = await adapter.requestDevice(config?.device);

    if (!device) {
        throw new Error('Failed to request the GPU device.');
    }

    const preferredFormat = gpu.getPreferredCanvasFormat();

    return Object.freeze({
        gpu,
        adapter,
        device,
        preferredFormat
    });
}

export {
    createGPUContext
};
