import { VertexAttribute } from '~/buffers';

import { defineReadOnlyProperty } from '~/utils';

import { MAX_16_BIT_VALUE } from '~/constants';

import type { GeometryAttributeNames, GeometryVertexData } from '~/types';

abstract class Geometry {
	declare private _topology: GPUPrimitiveTopology;
	declare private _indices: Uint16Array | Uint32Array | null;

	declare readonly attributes: Map<GeometryAttributeNames, VertexAttribute>;

	constructor() {
		this._topology = 'triangle-list';
		this._indices = null;

		const attributes = new Map();

		defineReadOnlyProperty(this, 'attributes', attributes);
	}

	get length() {
		let size = 0;

		this.attributes.forEach((attribute) => {
			size += attribute.length;
		});

		return size;
	}

	get stride() {
		let stride = 0;

		this.attributes.forEach((attribute) => {
			stride += attribute.stride;
		});

		return stride;
	}

	get vertexCount() {
		const hasPositionAttribute = this.hasAttribute('position');

		if (hasPositionAttribute) {
			const positionAttribute = this.getAttribute('position');

			// @ts-expect-error 'positionAttribute' is possibly 'undefined'.
			return positionAttribute.count;
		}

		return 0;
	}

	get byteLength() {
		let size = 0;

		this.attributes.forEach((attribute) => {
			size += attribute.byteLength;
		});

		return size;
	}

	get byteStride() {
		let stride = 0;

		this.attributes.forEach((attribute) => {
			stride += attribute.byteStride;
		});

		return stride;
	}

	get topology() {
		return this._topology;
	}

	get indices() {
		return this._indices;
	}

	get indexFormat(): GPUIndexFormat | null {
		if (this.indices instanceof Uint16Array) {
			return 'uint16';
		}

		if (this.indices instanceof Uint32Array) {
			return 'uint32';
		}

		return null;
	}

	get hasIndices() {
		return Boolean(this.indices && this.indices.length);
	}

	set topology(value: GPUPrimitiveTopology) {
		this._topology = value;

		this._updateIndices(value);
	}

	set indices(value: Uint16Array | Uint32Array | null) {
		this._indices = value;
	}

	protected _generatePointListIndices() {
		const positionAttribute = this.getAttribute('position');

		const indices: number[] = [];

		if (positionAttribute) {
			const { vertexCount } = this;

			for (let i = 0; i < vertexCount; i++) {
				indices.push(i);
			}
		}

		return indices;
	}

	private _generateIndices(topology: GPUPrimitiveTopology) {
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
		const vertexData = this._generateVertexData();

		const hasPositionAttribute = this.hasAttribute('position');
		const hasNormalAttribute = this.hasAttribute('normal');
		const hasUVAttribute = this.hasAttribute('uv');

		if (hasPositionAttribute) {
			const positionAttribute = this.getAttribute('position');

			// @ts-expect-error 'positionAttribute' is possibly 'undefined'.
			positionAttribute.array.set(vertexData.vertices);
		} else {
			const positionAttribute = new VertexAttribute(new Float32Array(vertexData.vertices), 'float32x3');

			this.setAttribute('position', positionAttribute);
		}

		if (hasNormalAttribute) {
			const normalAttribute = this.getAttribute('normal');

			// @ts-expect-error 'normalAttribute' is possibly 'undefined'.
			normalAttribute.array.set(vertexData.normals);
		} else {
			const normalAttribute = new VertexAttribute(new Float32Array(vertexData.normals), 'float32x3');

			this.setAttribute('normal', normalAttribute);
		}

		if (hasUVAttribute) {
			const uvAttribute = this.getAttribute('uv');

			// @ts-expect-error 'uvAttribute' is possibly 'undefined'.
			uvAttribute.array.set(vertexData.uvs);
		} else {
			const uvAttribute = new VertexAttribute(new Float32Array(vertexData.uvs), 'float32x2');

			this.setAttribute('uv', uvAttribute);
		}
	}

	private _updateIndices(topology: GPUPrimitiveTopology) {
		const indices = this._generateIndices(topology);
		const indicesArray = this.length <= MAX_16_BIT_VALUE ? new Uint16Array(indices) : new Uint32Array(indices);

		this.setIndices(indicesArray);
	}

	protected abstract _generateVertexData(): GeometryVertexData;

	protected abstract _generateLineListIndices(): number[];

	protected abstract _generateTriangleListIndices(): number[];

	protected abstract _generateLineStripIndices(): number[];

	protected abstract _generateTriangleStripIndices(): number[];

	setAttribute(name: GeometryAttributeNames, attribute: VertexAttribute) {
		this.attributes.set(name, attribute);

		return this;
	}

	getAttribute(name: GeometryAttributeNames) {
		return this.attributes.get(name);
	}

	hasAttribute(name: GeometryAttributeNames) {
		return this.attributes.has(name);
	}

	setIndices(indices: Uint16Array | Uint32Array) {
		this.indices = indices;

		return this;
	}

	setTopology(topology: GPUPrimitiveTopology) {
		this.topology = topology;

		return this;
	}
}

export default Geometry;
