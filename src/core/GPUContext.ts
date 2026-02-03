import type { GPUContextConfig } from '~/types';

class GPUContext {
	#gpu: GPU | null;
	#adapter: GPUAdapter | null;
	#device: GPUDevice | null;
	#preferredFormat: GPUTextureFormat | null;

	constructor() {
		this.#gpu = null;
		this.#adapter = null;
		this.#device = null;
		this.#preferredFormat = null;
	}

	get gpu() {
		return this.#gpu;
	}

	get adapter() {
		return this.#adapter;
	}

	get device() {
		return this.#device;
	}

	get preferredFormat() {
		return this.#preferredFormat;
	}

	async init(config?: Partial<GPUContextConfig>) {
		try {
			if (this.gpu && this.adapter && this.device) {
				throw new Error('[GPUContext]: Device has already been initialized.');
			}

			const gpu = navigator.gpu;
			const adapter = await gpu.requestAdapter(config?.adapter);

			if (adapter) {
				const device = await adapter.requestDevice(config?.device);
				const preferredFormat = gpu.getPreferredCanvasFormat();

				this.#gpu = gpu;
				this.#adapter = adapter;
				this.#device = device;
				this.#preferredFormat = preferredFormat;

				this.#handleDeviceLost();
			}
		}
		catch (error) {
			console.error(error);

			throw error;
		}
	}

	async #handleDeviceLost() {
		const { device } = this;

		if (device) {
			const { reason, message } = await device.lost;

			const needsLocationReload = confirm(`[GPUContext]: GPU device is lost.\nReason: ${reason}\nMessage: ${message}`);

			if (needsLocationReload) {
				location.reload();
			}
		}
	}
}

const gpuContextInstance = new GPUContext();

export default gpuContextInstance;
