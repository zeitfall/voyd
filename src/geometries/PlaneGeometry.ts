import Geometry from './Geometry';

import { VertexAttribute } from '~/buffers';

import { MAX_16_BIT_VALUE } from '~/constants';

class PlaneGeometry extends Geometry {
	constructor(
		public width: number,
		public height: number,
		public segmentsX = 1,
		public segmentsY = 1,
	) {
		super();

		this.#updateVertices();
		this.#updateIndices();
	}

	#generateVertices() {
		const { width, height, segmentsX, segmentsY } = this;

		const halfWidth = width / 2;
		const halfHeight = height / 2;

		const segmentWidth = width / segmentsX;
		const segmentHeight = height / segmentsY;

		const vertices: number[] = [];

		for (let j = 0; j <= segmentsY; j++) {
			const y = j * segmentHeight - halfHeight;

			for (let i = 0; i <= segmentsX; i++) {
				const x = i * segmentWidth - halfWidth;

				vertices.push(x, -y, 0);
			}
		}

		return vertices;
	}

	#generatePointListIndices() {
		const positionAttribute = this.getAttribute('position');

		const indices: number[] = [];

		if (positionAttribute) {
			const vertexCount = positionAttribute.array.length;

			for (let i = 0; i <= vertexCount; i++) {
				indices.push(i);
			}
		}

		return indices;
	}

	#generateLineListIndices() {
		const { segmentsX, segmentsY } = this;

		const vertexPerRow = segmentsX + 1;

		const indices: number[] = [];

		for (let j = 0; j < segmentsY; j++) {
			const rowOffset = j * vertexPerRow;

			for (let i = 0; i < segmentsX; i++) {
				const A = rowOffset + i;
				const B = A + 1;
				const C = A + vertexPerRow;
				const D = C + 1;

				indices.push(B, A, A, C, C, D, D, B, B, C);
			}
		}

		return indices;
	}

	// #generateLineStripIndices() {
	// 	const indices: number[] = [];

	// 	return indices;
	// }

	#generateTriangleListIndices() {
		const { segmentsX, segmentsY } = this;

		const vertexPerRow = segmentsX + 1;

		const indices: number[] = [];

		for (let j = 0; j < segmentsY; j++) {
			const rowOffset = j * vertexPerRow;

			for (let i = 0; i < segmentsX; i++) {
				const A = rowOffset + i;
				const B = A + 1;
				const C = A + vertexPerRow;
				const D = C + 1;

				indices.push(B, A, C, B, C, D);
			}
		}

		return indices;
	}

	// #generateTriangleStripIndices() {
	// 	const indices: number[] = [];

	// 	return indices;
	// }

	#generateIndices(topology: GPUPrimitiveTopology) {
		let indices: number[];

		switch (topology) {
			case 'point-list':
				indices = this.#generatePointListIndices();

				break;

			case 'line-list':
				indices = this.#generateLineListIndices();

				break;

			// case 'line-strip':
			// 	indices = this.#generateLineStripIndices();

			// 	break;

			case 'triangle-list':
				indices = this.#generateTriangleListIndices();

				break;

			// case 'triangle-strip':
			// 	indices = this.#generateTriangleStripIndices();

			// 	break;

			default:
				indices = [];

				throw new Error(`[PlaneGeometry]: Unsupported topology "${topology}"`);
		}

		return indices;
	}

	#updateVertices() {
		const vertices = this.#generateVertices();
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

	#updateIndices(topology: GPUPrimitiveTopology = 'triangle-list') {
		const indices = this.#generateIndices(topology);
		const indicesArray = this.length <= MAX_16_BIT_VALUE ? new Uint16Array(indices) : new Uint32Array(indices);

		this.setIndices(indicesArray);
	}

	setWidth(value: number) {
		this.width = value;

		this.#updateVertices();
	}

	setHeight(value: number) {
		this.height = value;

		this.#updateVertices();
	}

	setSize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.#updateVertices();
	}

	setSegmentsX(value: number) {
		this.segmentsX = value;

		this.#updateVertices();
	}

	setSegmentsY(value: number) {
		this.segmentsY = value;

		this.#updateVertices();
	}

	setSegments(x: number, y: number) {
		this.segmentsX = x;
		this.segmentsY = y;

		this.#updateVertices();
	}
}

export default PlaneGeometry;
