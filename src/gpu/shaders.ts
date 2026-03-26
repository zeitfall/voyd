let nextModuleId = 0;

const moduleCache = new Map<string, GPUShaderModule>();
const moduleIds = new WeakMap<GPUShaderModule, number>();

function createShaderModule(device: GPUDevice, descriptor: GPUShaderModuleDescriptor) {
    const moduleKey = btoa(JSON.stringify(descriptor));
    let module = moduleCache.get(moduleKey);

    if (!module) {
        module = device.createShaderModule(descriptor);

        moduleCache.set(moduleKey, module);
        moduleIds.set(module, nextModuleId++);
    }

    return module;
}

function invalidateShaderModuleCache() {
    nextModuleId = 0;

    moduleCache.clear();
}

function getShaderModuleId(module: GPUShaderModule) {
    return moduleIds.get(module);
}

export {
    createShaderModule,
    invalidateShaderModuleCache,
    getShaderModuleId
};
