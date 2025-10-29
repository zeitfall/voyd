import Geometry from './Geometry';

import { TWO_PI } from '~/constants';

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

		this._updateVertices();
		this._updateIndices();
	}

	protected _generateVertices() {
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

	protected _generatePointListIndices() {
		const { segments } = this;

		const indices = [0, 0, 0];

		for (let i = 0; i <= segments; i++) {
			indices.push(i);
		}

		return indices;
	}

	protected _generateLineListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = A < segments ? A + 1 : 1;

			indices.push(0, A, A, B);
		}

		return indices;
	}

	protected _generateLineStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = A < segments ? A + 1 : 1;

			indices.push(0, A, B);
		}

		return indices;
	}

	protected _generateTriangleStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	setRadius(value: number) {
		this.radius = value;

		this._updateVertices();
	}

	setSegments(value: number) {
		this.segments = value;

		this._updateVertices();
	}
}

export default CircleGeometry;
