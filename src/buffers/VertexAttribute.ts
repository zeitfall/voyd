import { VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP, VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

import type { TypedArray } from '~/types';

class VertexAttribute<T extends TypedArray = TypedArray> {
	#array: TypedArray;
	#format: GPUVertexFormat;

	constructor(array: T, format: GPUVertexFormat) {
		this.#array = array;
		this.#format = format;
	}

	get array() {
		return this.#array;
	}

	get format() {
		return this.#format;
	}

	get length() {
		return this.#array.length;
	}

	get stride() {
		return VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[this.#format];
	}

	get itemCount() {
		return Math.floor(this.length / this.stride);
	}

	get byteLength() {
		return this.#array.byteLength;
	}

	get byteStride() {
		return VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[this.#format];
	}

	getItem(index: number) {
		const { stride } = this;

		const startIndex = index * stride;
		const endIndex = startIndex + stride;

		return this.#array.slice(startIndex, endIndex) as T;
	}
}

export default VertexAttribute;
