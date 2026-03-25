export interface GPUContextConfig {
	adapter: GPURequestAdapterOptions;
	device: GPUDeviceDescriptor;
}

export interface GPUContext {
	readonly gpu: GPU;
	readonly adapter: GPUAdapter;
	readonly device: GPUDevice;
	readonly preferredFormat: GPUTextureFormat;
}

export interface CommandBufferCallback {
	(encoder: GPUCommandEncoder): void;
}

export interface RenderBundleCallback {
    (encoder: GPURenderBundleEncoder): void;
}
