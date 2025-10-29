import { defineReadOnlyProperties } from '~/utils';

import { VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP, VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

import type { TypedArray } from '~/types';

class VertexAttribute<T extends TypedArray = TypedArray> {
	declare readonly array: TypedArray;
	declare readonly format: GPUVertexFormat;

	constructor(array: T, format: GPUVertexFormat) {
		defineReadOnlyProperties(this, { array, format });
	}

	get length() {
		return this.array.length;
	}

	get stride() {
		return VERTEX_ATTRIBUTE_COMPONENT_COUNT_MAP[this.format];
	}

	get itemCount() {
		return Math.floor(this.length / this.stride);
	}

	get byteLength() {
		return this.array.byteLength;
	}

	get byteStride() {
		return VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[this.format];
	}

	getItem(index: number) {
		const { stride } = this;

		const startIndex = index * stride;
		const endIndex = startIndex + stride;

		return this.array.subarray(startIndex, endIndex) as T;
	}
}

export default VertexAttribute;
