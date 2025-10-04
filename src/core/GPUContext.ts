import type { GPUContextConfig } from '~/types';

class GPUContext {
	static #gpu: GPU;
	static #adapter: GPUAdapter;
	static #device: GPUDevice;

	static get gpu() {
		return this.#gpu;
	}

	static get adapter() {
		return this.#adapter;
	}

	static get device() {
		return this.#device;
	}

	static get limits() {
		return this.device.limits;
	}

	static get features() {
		return this.device.features;
	}

	static async #handleDeviceLost() {
		if (this.device) {
			const { reason, message } = await this.device.lost;
			
			const needsLocationReload = window.confirm(`[GPUContext]: GPU device is lost.\nReason: ${reason}\nMessage: ${message}`);

			if (needsLocationReload) {
				window.location.reload();
			}
		}
	}

	static async init(config?: Partial<GPUContextConfig>) {
		try {
			if (this.gpu && this.adapter && this.device) {
				throw new Error('[GPUContext]: Device has already been initialized.');
			}

            const gpu = navigator.gpu;
			const adapter = await gpu.requestAdapter(config?.adapter);

			if (adapter) {
				const device = await adapter.requestDevice(config?.device);

				this.#gpu = gpu;
				this.#adapter = adapter;
				this.#device = device;

				this.#handleDeviceLost();
			}
		}
        catch (error) {
			console.error(error);
		}
	}

	static hasFeature(name: GPUFeatureName) {
		return this.features.has(name);
	}

	constructor() {
		const { gpu, adapter, device } = GPUContext;

		if (gpu && adapter && device) {
			return;
		}

		throw new Error('[GPUContext]: Device hasn\'t been initialized yet.');
	}

	get gpu() {
		return GPUContext.gpu;
	}

	get adapter() {
		return GPUContext.adapter;
	}

	get device() {
		return GPUContext.device;
	}

	get features() {
		return GPUContext.features;
	}

	get limits() {
		return GPUContext.limits;
	}

	hasFeature(name: GPUFeatureName) {
		return GPUContext.hasFeature(name);
	}
}

export default GPUContext;
