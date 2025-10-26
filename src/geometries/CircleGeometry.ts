import Geometry from './Geometry';

import { VertexAttribute } from '~/buffers';

import { MAX_16_BIT_VALUE, TWO_PI } from '~/constants';

const MIN_CIRCLE_SEGMENT_COUNT = 3;

class CircleGeometry extends Geometry {
	constructor(
		public radius: number,
		public segments = MIN_CIRCLE_SEGMENT_COUNT,
	) {
		super();

		if (segments < MIN_CIRCLE_SEGMENT_COUNT) {
			throw new Error(`[CircleGeometry]: Circle geometry must have at least ${MIN_CIRCLE_SEGMENT_COUNT} segments.`);
		}

		this.#updateVertices();
		this.#updateIndices();
	}

	#generateVertices() {
		const { radius, segments } = this;

		const sectorAngle = TWO_PI / segments;

		const vertices = [0, 0, 0];

		for (let i = 0; i < segments; i++) {
			const x = radius * Math.cos(i * sectorAngle);
			const y = radius * Math.sin(i * sectorAngle);

			vertices.push(x, y, 0);
		}

		return vertices;
	}

	#generatePointListIndices() {
		const { segments } = this;

		const indices = [0, 0, 0];

		for (let i = 0; i <= segments; i++) {
			indices.push(i);
		}

		return indices;
	}

	#generateLineListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = A < segments ? A + 1 : 1;

			indices.push(0, A, A, B);
		}

		return indices;
	}

	// #generateLineStripIndices() {
	// 	const indices: number[] = [];

	// 	return indices;
	// }

	#generateTriangleListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = A < segments ? A + 1 : 1;

			indices.push(0, A, B);
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

				throw new Error(`[CircleGeometry]: Unsupported topology "${topology}"`);
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

	setRadius(value: number) {
		this.radius = value;

		this.#updateVertices();
	}

	setSegments(value: number) {
		this.segments = value;

		this.#updateVertices();
	}
}

export default CircleGeometry;
