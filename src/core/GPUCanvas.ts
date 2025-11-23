class GPUCanvas extends HTMLCanvasElement {
	#resizeObserver: ResizeObserver;
	#resizeEvent: UIEvent;

	constructor() {
		super();

		this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
		this.#resizeEvent = new UIEvent('resize');
	}

	get aspectRatio() {
		return this.width / this.height;
	}

	connectedCallback() {
		this.style.width = '100%';
		this.style.height = '100%';
		this.style.touchAction = 'none';

		this.addEventListener('contextmenu', this.#handleContextMenu);

		this.#resizeObserver.observe(this);
	}

	disconnectedCallback() {
		this.removeEventListener('contextmenu', this.#handleContextMenu);

		this.#resizeObserver.disconnect();
	}

	#handleContextMenu(event: PointerEvent) {
		event.preventDefault();
	}

	#handleResize(entries: ResizeObserverEntry[]) {
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

		this.dispatchEvent(this.#resizeEvent);
	}
}

export default GPUCanvas;
