import { defineReadOnlyProperties } from '~/utils';

class GPUCanvas extends HTMLCanvasElement {
	declare private readonly _resizeObserver: ResizeObserver;
	declare private readonly _resizeEvent: UIEvent;

	constructor() {
		super();

		const _resizeObserver = new ResizeObserver(this._handleResize.bind(this));
		const _resizeEvent = new UIEvent('resize');

		// @ts-expect-error Object literal may only specify known properties, and 'resizeObserver' does not exist in type 'Record<keyof this, unknown>'.
		defineReadOnlyProperties(this, { _resizeObserver, _resizeEvent });
	}

	get aspectRatio() {
		return this.width / this.height;
	}

	private _handleResize(entries: ResizeObserverEntry[]) {
		const { contentBoxSize, devicePixelContentBoxSize } = entries[0];

		let width: number;
		let height: number;

		if (devicePixelContentBoxSize) {
			const { inlineSize, blockSize } = devicePixelContentBoxSize[0];

			width = inlineSize;
			height = blockSize;
		} else {
			const { inlineSize, blockSize } = contentBoxSize[0];

			width = devicePixelRatio * inlineSize;
			height = devicePixelRatio * blockSize;
		}

		this.width = width;
		this.height = height;

		this.dispatchEvent(this._resizeEvent);
	}

	connectedCallback() {
		this.style.width = '100%';
		this.style.height = '100%';

		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		this._resizeObserver.disconnect();
	}
}

export default GPUCanvas;
