import type { GPUContextConfig } from '~/types';

class GPUContext {
	static #gpu: GPU;
	static #adapter: GPUAdapter;
	static #device: GPUDevice;

	static get gpu() {
		return GPUContext.#gpu;
	}

	static get adapter() {
		return GPUContext.#adapter;
	}

	static get device() {
		return GPUContext.#device;
	}

	static get limits() {
		return GPUContext.device.limits;
	}

	static get features() {
		return GPUContext.device.features;
	}

	static async #handleDeviceLost() {
		const { device } = GPUContext;

		if (device) {
			const { reason, message } = await device.lost;

			const needsLocationReload = window.confirm(
				`[GPUContext]: GPU device is lost.\nReason: ${reason}\nMessage: ${message}`,
			);

			if (needsLocationReload) {
				window.location.reload();
			}
		}
	}

	static async init(config?: Partial<GPUContextConfig>) {
		try {
			if (GPUContext.gpu && GPUContext.adapter && GPUContext.device) {
				throw new Error('[GPUContext]: Device has already been initialized.');
			}

			const gpu = navigator.gpu;
			const adapter = await gpu.requestAdapter(config?.adapter);

			if (adapter) {
				const device = await adapter.requestDevice(config?.device);

				GPUContext.#gpu = gpu;
				GPUContext.#adapter = adapter;
				GPUContext.#device = device;

				GPUContext.#handleDeviceLost();
			}
		} catch (error) {
			console.error(error);
		}
	}

	static hasFeature(name: GPUFeatureName) {
		return GPUContext.features.has(name);
	}

	private constructor() {
		throw new Error('[GPUContext]: This class is not constructable. Please, consider using GPUContext.init() instead.');
	}
}

export default GPUContext;
