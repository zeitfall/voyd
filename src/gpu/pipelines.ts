import { getShaderModuleId } from './shaders';

const pipelineCache = new Map<string, GPUPipelineBase>();

function createRenderPipeline(device: GPUDevice, descriptor: GPURenderPipelineDescriptor) {
    const pipelineKey = getRenderPipelineKey(descriptor);
    let pipeline = pipelineCache.get(pipelineKey);

    if (!pipeline) {
        pipeline = device.createRenderPipeline(descriptor);

        pipelineCache.set(pipelineKey, pipeline);
    }

    return pipeline as GPURenderPipeline;
}

async function createRenderPipelineAsync(device: GPUDevice, descriptor: GPURenderPipelineDescriptor) {
    const pipelineKey = getRenderPipelineKey(descriptor);
    let pipeline = pipelineCache.get(pipelineKey);

    if (!pipeline) {
        pipeline = await device.createRenderPipelineAsync(descriptor);

        pipelineCache.set(pipelineKey, pipeline);
    }

    return pipeline as GPURenderPipeline;
}

function createComputePipeline(device: GPUDevice, descriptor: GPUComputePipelineDescriptor) {
    const pipelineKey = getComputePipelineKey(descriptor);
    let pipeline = pipelineCache.get(pipelineKey);

    if (!pipeline) {
        pipeline = device.createComputePipeline(descriptor);

        pipelineCache.set(pipelineKey, pipeline);
    }

    return pipeline as GPUComputePipeline;
}

async function createComputePipelineAsync(device: GPUDevice, descriptor: GPUComputePipelineDescriptor) {
    const pipelineKey = getComputePipelineKey(descriptor);
    let pipeline = pipelineCache.get(pipelineKey);

    if (!pipeline) {
        pipeline = await device.createComputePipelineAsync(descriptor);

        pipelineCache.set(pipelineKey, pipeline);
    }

    return pipeline as GPUComputePipeline;
}

function invalidatePipelineCache() {
    pipelineCache.clear();
}

function getRenderPipelineKey(descriptor: GPURenderPipelineDescriptor): string {
    const vertexState = descriptor.vertex;
    const fragmentState = descriptor.fragment;

    const descriptorToStringify = {
        ...descriptor,
        vertex: {
            ...vertexState,
            module: getShaderModuleId(vertexState.module)
        },
        fragment: {}
    };

    if (fragmentState) {
        descriptorToStringify.fragment = {
            ...fragmentState,
            module: getShaderModuleId(fragmentState.module)
        };
    }

    return btoa(JSON.stringify(descriptorToStringify));
}

function getComputePipelineKey(descriptor: GPUComputePipelineDescriptor): string {
    const descriptorToStringify = {
        ...descriptor,
        compute: {
            ...descriptor.compute,
            module: getShaderModuleId(descriptor.compute.module)
        }
    };

    return btoa(JSON.stringify(descriptorToStringify));
}

export {
    createRenderPipeline,
    createRenderPipelineAsync,
    createComputePipeline,
    createComputePipelineAsync,
    invalidatePipelineCache
};
