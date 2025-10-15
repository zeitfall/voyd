import type { VertexAttribute } from '~/buffers';
import type { VertexAttributeNames } from '~/types';

class Geometry {
	#attributes: Map<VertexAttributeNames, VertexAttribute>;

	constructor() {
		this.#attributes = new Map();
	}

	get attributes() {
		return this.#attributes;
	}

	get attributesStride() {
		let stride = 0;

		this.#attributes.forEach((attribute) => {
			stride += attribute.stride;
		});

		return stride;
	}

	get attributesByteStride() {
		let stride = 0;

		this.#attributes.forEach((attribute) => {
			stride += attribute.byteStride;
		});

		return stride;
	}

	setAttribute(name: VertexAttributeNames, attribute: VertexAttribute) {
		this.#attributes.set(name, attribute);

		return this;
	}

	getAttribute(name: VertexAttributeNames) {
		return this.#attributes.get(name);
	}

	hasAttribute(name: VertexAttributeNames) {
		return this.#attributes.has(name);
	}

	// TODO: Implement
	toInterleavedBuffer() {
		const arrayBuffer = new ArrayBuffer();
		// const arrayBufferView = new Uint8Array(arrayBuffer);

		return arrayBuffer;
	}
}

export default Geometry;
