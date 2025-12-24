export interface GPUContextConfig {
	adapter: GPURequestAdapterOptions;
	device: GPUDeviceDescriptor;
}

export interface RenderBundleCallback {
    (encoder: GPURenderBundleEncoder): void;
}
