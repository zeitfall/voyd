import { VertexAttribute } from '~/buffers';

import { defineReadOnlyProperty, defineWritableProperty } from '~/utils';

import { MAX_16_BIT_VALUE } from '~/constants';

import type { VertexAttributeNames } from '~/types';

abstract class Geometry {
	declare readonly attributes: Map<VertexAttributeNames, VertexAttribute>;
	declare indices: Uint16Array | Uint32Array | null;

	constructor() {
		const attributes = new Map();
		const indices = null;

		defineReadOnlyProperty(this, 'attributes', attributes);
		defineWritableProperty(this, 'indices', indices);
	}

	get hasIndices() {
		return Boolean(this.indices && this.indices.length);
	}

	get length() {
		let length = 0;

		this.attributes.forEach((attribute) => {
			length += attribute.length;
		});

		return length;
	}

	get stride() {
		let stride = 0;

		this.attributes.forEach((attribute) => {
			stride += attribute.stride;
		});

		return stride;
	}

	get byteLength() {
		let length = 0;

		this.attributes.forEach((attribute) => {
			length += attribute.byteLength;
		});

		return length;
	}

	get byteStride() {
		let stride = 0;

		this.attributes.forEach((attribute) => {
			stride += attribute.byteStride;
		});

		return stride;
	}

	protected _generateIndices(topology: GPUPrimitiveTopology) {
		let indices: number[];

		switch (topology) {
			case 'point-list':
				indices = this._generatePointListIndices();

				break;

			case 'line-list':
				indices = this._generateLineListIndices();

				break;

			case 'line-strip':
				indices = this._generateLineStripIndices();

				break;

			case 'triangle-list':
				indices = this._generateTriangleListIndices();

				break;

			case 'triangle-strip':
				indices = this._generateTriangleStripIndices();

				break;

			default:
				throw new Error(`[Geometry]: Unsupported topology "${topology}"`);
		}

		return indices;
	}

	protected _updateVertices() {
		const vertices = this._generateVertices();
		const hasPositionAttribute = this.hasAttribute('position');

		if (hasPositionAttribute) {
			const positionAttribute = this.getAttribute('position');

			// @ts-expect-error 'positionAttribute' is possibly 'undefined'.
			positionAttribute.array.set(vertices);
		} else {
			const positionAttribute = new VertexAttribute(new Float32Array(vertices), 'float32x3');

			this.setAttribute('position', positionAttribute);
		}
	}

	protected _updateIndices(topology: GPUPrimitiveTopology = 'triangle-list') {
		const indices = this._generateIndices(topology);
		const indicesArray = this.length <= MAX_16_BIT_VALUE ? new Uint16Array(indices) : new Uint32Array(indices);

		this.setIndices(indicesArray);
	}

	protected abstract _generateVertices(): number[];

	protected abstract _generatePointListIndices(): number[];

	protected abstract _generateLineListIndices(): number[];

	protected abstract _generateLineStripIndices(): number[];

	protected abstract _generateTriangleListIndices(): number[];

	protected abstract _generateTriangleStripIndices(): number[];

	setAttribute(name: VertexAttributeNames, attribute: VertexAttribute) {
		this.attributes.set(name, attribute);

		return this;
	}

	getAttribute(name: VertexAttributeNames) {
		return this.attributes.get(name);
	}

	hasAttribute(name: VertexAttributeNames) {
		return this.attributes.has(name);
	}

	setIndices(indices: Uint16Array | Uint32Array) {
		this.indices = indices;

		return this;
	}
}

export default Geometry;
