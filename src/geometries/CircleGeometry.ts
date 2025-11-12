import Geometry from './Geometry';

import { defineWritableProperties } from '~/utils';

import { TWO_PI } from '~/constants';

const MIN_CIRCLE_SEGMENT_COUNT = 3;

class CircleGeometry extends Geometry {
	declare private _radius: number;
	declare private _segments: number;

	constructor(radius = 1, segments = 8) {
		super();

		if (segments < MIN_CIRCLE_SEGMENT_COUNT) {
			throw new Error(`[CircleGeometry]: Circle geometry must have at least ${MIN_CIRCLE_SEGMENT_COUNT} segments.`);
		}

		defineWritableProperties(this, {
			// @ts-expect-error Object literal may only specify known properties, and '_radius' does not exist in type 'Record<keyof this, unknown>'.
			_radius: radius,
			_segments: segments,
		});

		this._updateVertices();

		this.setTopology('triangle-list');
	}

	get radius() {
		return this._radius;
	}

	get segments() {
		return this._segments;
	}

	set radius(value: number) {
		this._radius = value;

		this._updateVertices();
	}

	set segments(value: number) {
		this._segments = value;

		this._updateVertices();
	}

	protected _generateVertexData() {
		const { radius, segments } = this;

		const sectorAngle = TWO_PI / segments;

		const vertices = [0, 0, 0];
		const normals = [0, 0, -1];
		const uvs = [0, 0];

		for (let i = 0; i < segments; i++) {
			let x = Math.cos(i * sectorAngle);
			let y = Math.sin(i * sectorAngle);

			const u = (x + 1) / 2;
			const v = (y + 1) / 2;

			x *= radius;
			y *= radius;

			vertices.push(x, y, 0);
			normals.push(0, 0, -1);
			uvs.push(u, v);
		}

		return {
			vertices,
			normals,
			uvs
		};
	}

	protected _generateLineListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = i % segments + 1;

			indices.push(0, A, A, B);
		}

		return indices;
	}

	protected _generateTriangleListIndices() {
		const { segments } = this;

		const indices: number[] = [];

		for (let i = 1; i <= segments; i++) {
			const A = i;
			const B = i % segments + 1;

			indices.push(0, A, B);
		}

		return indices;
	}

	protected _generateLineStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	setRadius(value: number) {
		this.radius = value;

		return this;
	}

	setSegments(value: number) {
		this.segments = value;

		return this;
	}

	set(radius: number, segments: number) {
		this._radius = radius;
		this._segments = segments

		this._updateVertices();

		return this;
	}
}

export default CircleGeometry;
