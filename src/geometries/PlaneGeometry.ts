import Geometry from './Geometry';

class PlaneGeometry extends Geometry {
	constructor(
		public width: number,
		public height: number,
		public segmentsX = 1,
		public segmentsY = 1,
	) {
		super();

		this._updateVertices();
		this._updateIndices();
	}

	protected _generateVertices() {
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

	protected _generatePointListIndices() {
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

	protected _generateLineListIndices() {
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

	protected _generateLineStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleListIndices() {
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

	protected _generateTriangleStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	setWidth(value: number) {
		this.width = value;

		this._updateVertices();
	}

	setHeight(value: number) {
		this.height = value;

		this._updateVertices();
	}

	setSize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this._updateVertices();
	}

	setSegmentsX(value: number) {
		this.segmentsX = value;

		this._updateVertices();
	}

	setSegmentsY(value: number) {
		this.segmentsY = value;

		this._updateVertices();
	}

	setSegments(x: number, y: number) {
		this.segmentsX = x;
		this.segmentsY = y;

		this._updateVertices();
	}
}

export default PlaneGeometry;
