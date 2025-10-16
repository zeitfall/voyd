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

	get length() {
		let length = 0;

		this.#attributes.forEach((attribute) => {
			length += attribute.length;
		});

		return length;
	}

	get stride() {
		let stride = 0;

		this.#attributes.forEach((attribute) => {
			stride += attribute.stride;
		});

		return stride;
	}

	get byteLength() {
		let length = 0;

		this.#attributes.forEach((attribute) => {
			length += attribute.byteLength;
		});

		return length;
	}

	get byteStride() {
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
}

export default Geometry;
