import type { GPUContextConfig } from '~/types';

class GPUContext extends EventTarget {
	#gpu: GPU | null;
	#adapter: GPUAdapter | null;
	#device: GPUDevice | null;
	#preferredFormat: GPUTextureFormat | null;

	constructor() {
		super();

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
		if (this.gpu && this.adapter && this.device) {
			console.warn('[GPUContext]: Device has already been initialized.');

			return this;
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

		return this;
	}

	async #handleDeviceLost() {
		const device = this.#device;

		if (!device) {
			return;
		}

		const deviceLostInfo = await device.lost;
		const deviceLostEvent = new CustomEvent('devicelost', { detail: deviceLostInfo });

		switch (deviceLostInfo.reason) {
			case 'destroyed':
				console.warn('[GPUContext]: Device has been destroyed intentionally.');

				break;

			case 'unknown':
				console.warn('[GPUContext]: Device has been lost because of unknown issue.');

				break;
		}

		this.#gpu = null;
		this.#adapter = null;
		this.#device = null;
		this.#preferredFormat = null;

		this.dispatchEvent(deviceLostEvent);
	}
}

const gpuContextInstance = new GPUContext();

export default gpuContextInstance;
