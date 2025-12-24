import GPUContext from './GPUContext';
import Instance from './Instance';

import type { RenderBundleCallback } from '~/types';

class RenderBundle extends Instance<GPURenderBundle> {
    constructor(callback: RenderBundleCallback, descriptor: GPURenderBundleEncoderDescriptor) {
        const encoder = GPUContext.device.createRenderBundleEncoder(descriptor);

        callback(encoder);

        const instance = encoder.finish();

        super(instance);
    }
}

export default RenderBundle;
