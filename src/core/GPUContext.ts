import GPUCanvas from './GPUCanvas';

import { defineReadOnlyProperties } from '~/utils';

import type { GPUContextConfig } from '~/types';

class GPUContext {
	declare static readonly gpu: GPU;
	declare static readonly adapter: GPUAdapter;
	declare static readonly device: GPUDevice;
	declare static readonly preferredFormat: GPUTextureFormat;

	static get limits() {
		return GPUContext.device.limits;
	}

	static get features() {
		return GPUContext.device.features;
	}

	private static async _handleDeviceLost() {
		const { device } = GPUContext;

		if (device) {
			const { reason, message } = await device.lost;

			const needsLocationReload = confirm(`[GPUContext]: GPU device is lost.\nReason: ${reason}\nMessage: ${message}`);

			if (needsLocationReload) {
				location.reload();
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
				const preferredFormat = gpu.getPreferredCanvasFormat();

				defineReadOnlyProperties(GPUContext, {
					gpu,
					adapter,
					device,
					preferredFormat,
				});

				GPUContext._handleDeviceLost();

				customElements.define('gpu-canvas', GPUCanvas, { extends: 'canvas' });
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
