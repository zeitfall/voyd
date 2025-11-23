import GPUCanvas from './GPUCanvas';

import type { GPUContextConfig } from '~/types';

class GPUContext {
	static #gpu: GPU;
	static #adapter: GPUAdapter;
	static #device: GPUDevice;
	static #preferredFormat: GPUTextureFormat;

	static get gpu() {
		return GPUContext.#gpu;
	}

	static get adapter() {
		return GPUContext.#adapter;
	}

	static get device() {
		return GPUContext.#device;
	}

	static get preferredFormat() {
		return GPUContext.#preferredFormat;
	}

	static get limits() {
		return GPUContext.device.limits;
	}

	static get features() {
		return GPUContext.device.features;
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
				const preferredFormat = gpu.getPreferredCanvasFormat();

				this.#gpu = gpu;
				this.#adapter = adapter;
				this.#device = device;
				this.#preferredFormat = preferredFormat;

				GPUContext.#handleDeviceLost();

				customElements.define('gpu-canvas', GPUCanvas, { extends: 'canvas' });
			}
		} catch (error) {
			console.error(error);
		}
	}

	static hasFeature(name: GPUFeatureName) {
		return GPUContext.features.has(name);
	}

	static async #handleDeviceLost() {
		const { device } = GPUContext;

		if (device) {
			const { reason, message } = await device.lost;

			const needsLocationReload = confirm(`[GPUContext]: GPU device is lost.\nReason: ${reason}\nMessage: ${message}`);

			if (needsLocationReload) {
				location.reload();
			}
		}
	}

	private constructor() {
		throw new Error('[GPUContext]: This class is not constructable. Please, consider using GPUContext.init() instead.');
	}
}

export default GPUContext;
