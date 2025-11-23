import Geometry from './Geometry';

const MIN_SEGMENTS_X = 1;
const MIN_SEGMENTS_Y = 1;

class PlaneGeometry extends Geometry {
	#width: number;
	#height: number;
	#segmentsX: number;
	#segmentsY: number;

	constructor(width = 1, height = 1, segmentsX = 1, segmentsY = 1) {
		super();

		if (segmentsX < 1) {
			throw new Error(`[PlaneGeometry]: Plane geometry must have at least ${MIN_SEGMENTS_X} segments per row.`);
		}

		if (segmentsY < 1) {
			throw new Error(`[PlaneGeometry]: Plane geometry must have at least ${MIN_SEGMENTS_Y} segments per column.`);
		}

		this.#width = width;
		this.#height = height;
		this.#segmentsX = segmentsX;
		this.#segmentsY = segmentsY;

		this._updateVertices();

		this.setTopology('triangle-list');
	}

	get width() {
		return this.#width;
	}

	set width(value: number) {
		this.#width = value;

		this._updateVertices();
	}

	get height() {
		return this.#height;
	}

	set height(value: number) {
		this.#height = value;

		this._updateVertices();
	}

	get segmentsX() {
		return this.#segmentsX;
	}

	set segmentsX(value: number) {
		this.#segmentsX = value;

		this._updateVertices();
	}

	get segmentsY() {
		return this.#segmentsY;
	}

	set segmentsY(value: number) {
		this.#segmentsY = value;

		this._updateVertices();
	}

	setWidth(value: number) {
		this.width = value;

		return this;
	}

	setHeight(value: number) {
		this.height = value;

		return this;
	}

	setSize(width: number, height: number) {
		this.#width = width;
		this.#height = height;

		this._updateVertices();

		return this;
	}

	setSegmentsX(value: number) {
		this.segmentsX = value;

		return this;
	}

	setSegmentsY(value: number) {
		this.segmentsY = value;

		return this;
	}

	setSegments(x: number, y: number) {
		this.#segmentsX = x;
		this.#segmentsY = y;

		this._updateVertices();

		return this;
	}

	protected _generateVertexData() {
		const { width, height, segmentsX, segmentsY } = this;

		const halfWidth = width / 2;
		const halfHeight = height / 2;

		const segmentWidth = width / segmentsX;
		const segmentHeight = height / segmentsY;

		const vertices: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];

		for (let j = 0; j <= segmentsY; j++) {
			let y = j * segmentHeight;
			const v = 1 - y / segmentsY;

			y -= halfHeight;

			for (let i = 0; i <= segmentsX; i++) {
				let x = i * segmentWidth;
				const u = x / segmentsX;

				x -= halfWidth;

				vertices.push(x, -y, .125 * Math.random());
				normals.push(0, 0, -1);
				uvs.push(u, v);
			}
		}

		return {
			vertices,
			normals,
			uvs,
		};
	}

	protected _generateLineListIndices() {
		const { segmentsX, segmentsY } = this;

		const vertexPerRow = segmentsX + 1;

		const indices: number[] = [];

		for (let j = 0; j < segmentsY; j++) {
			const currentRowStartIndex = j * vertexPerRow;
			const nextRowStartIndex = currentRowStartIndex + vertexPerRow;

			for (let i = 0; i <= segmentsX; i++) {
				const A = currentRowStartIndex + i;
				const B = nextRowStartIndex + i;
				const C = B + 1;

				// NOTE: Fills the most right line.
				if (i === segmentsX) {
					indices.push(A, B);

					continue;
				}

				// NOTE: Fills the most top line.
				if (j === 0) {
					const D = A + 1;

					indices.push(A, D);
				}

				indices.push(A, B, B, C, C, A);
			}
		}

		return indices;
	}

	protected _generateTriangleListIndices() {
		const { segmentsX, segmentsY } = this;

		const vertexPerRow = segmentsX + 1;

		const indices: number[] = [];

		for (let j = 0; j < segmentsY; j++) {
			const currentRowStartIndex = j * vertexPerRow;
			const nextRowStartIndex = currentRowStartIndex + vertexPerRow;

			for (let i = 0; i < segmentsX; i++) {
				const A = currentRowStartIndex + i;
				const B = nextRowStartIndex + i;
				const C = B + 1;
				const D = A + 1;

				indices.push(A, B, C, A, C, D);
			}
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
}

export default PlaneGeometry;
