class CanvasResizer {
	#canvasElement: HTMLCanvasElement;
	#resizeObserver: ResizeObserver;
	#resizeEvent: UIEvent;

	constructor(canvasElement: HTMLCanvasElement) {
		const resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
		const resizeEvent = new UIEvent('resize');

		canvasElement.style.width = '100%';
		canvasElement.style.height = '100%';
		canvasElement.style.touchAction = 'none';

		canvasElement.addEventListener('contextmenu', this.#handleContextMenu);

		resizeObserver.observe(canvasElement);

		this.#canvasElement = canvasElement;
        this.#resizeObserver = resizeObserver;
        this.#resizeEvent = resizeEvent;
	}

	disconnectedCallback() {
		this.#canvasElement.removeEventListener('contextmenu', this.#handleContextMenu);

		this.#resizeObserver.disconnect();
	}

	#handleContextMenu(event: PointerEvent) {
		event.preventDefault();
	}

	#handleResize(entries: ResizeObserverEntry[]) {
		const canvasElement = this.#canvasElement;

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

		canvasElement.width = width;
		canvasElement.height = height;

		canvasElement.dispatchEvent(this.#resizeEvent);
	}
}

export default CanvasResizer;
