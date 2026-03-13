import { GPUContext } from '~/core';

import type { RenderBundleCallback } from '~/types';

function createRenderBundle(callback: RenderBundleCallback, descriptor: GPURenderBundleEncoderDescriptor) {
    const encoder = GPUContext.device.createRenderBundleEncoder(descriptor);

    callback(encoder);

    return encoder.finish();
}

export {
    createRenderBundle
};
