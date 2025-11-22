import Geometry from './Geometry';

import { Vector3 } from '~/math';

import { PI, TWO_PI } from '~/constants';

const MIN_LONGITUDES = 3;
const MIN_LATITUDES = 2;

const _vertexNormal = new Vector3();

class SphereGeometry extends Geometry {
	declare private _radius: number;
	declare private _longitudes: number;
	declare private _latitudes: number;

	constructor(radius = 1, longitudes = 8, latitudes = 8) {
		super();

		if (longitudes < MIN_LONGITUDES) {
			throw new Error(`[SphereGeometry]: Sphere geometry must have at least ${MIN_LONGITUDES} longitudes.`);
		}

		if (latitudes < MIN_LATITUDES) {
			throw new Error(`[SphereGeometry]: Sphere geometry must have at least ${MIN_LATITUDES} latitudes.`);
		}

		this._radius = radius;
		this._longitudes = longitudes;
		this._latitudes = latitudes;

		this._updateVertices();

		this.setTopology('triangle-list');
	}

	get radius() {
		return this._radius;
	}

	get longitudes() {
		return this._longitudes;
	}

	get latitudes() {
		return this._latitudes;
	}

	set radius(value: number) {
		this._radius = value;

		this._updateVertices();
	}

	set longitudes(value) {
		this._longitudes = value;

		this._updateVertices();
	}

	set latitudes(value: number) {
		this._latitudes = value;

		this._updateVertices();
	}

	protected _generateVertexData() {
		const { radius, longitudes, latitudes } = this;

		const longitudeAngle = TWO_PI / longitudes;
		const latitudeAngle = PI / latitudes;

		const vertices: number[] = [];
		const normals: number[] = [];
		const uvs: number[] = [];

		vertices.push(0, radius, 0);
		normals.push(0, 1, 0);
		uvs.push(0, 0);

		for (let j = 1; j < latitudes; j++) {
			const phi = j * latitudeAngle;

			const sinPhi = Math.sin(phi);
			const cosPhi = Math.cos(phi);

			const v = 1 - j / latitudes;

			for (let i = 0; i < longitudes; i++) {
				const theta = i * longitudeAngle;

				const sinTheta = Math.sin(theta);
				const cosTheta = Math.cos(theta);

				const x = radius * sinPhi * cosTheta;
				const y = radius * cosPhi;
				const z = radius * sinPhi * sinTheta;

				const u = i / longitudes;

				_vertexNormal.set(x, y, z).normalize();

				vertices.push(x, y, z);
				normals.push(..._vertexNormal);
				uvs.push(u, v);
			}
		}

		vertices.push(0, -radius, 0);
		normals.push(0, -1, 0);
		uvs.push(0, 1);

		return {
			vertices,
			normals,
			uvs,
		};
	}

	protected _generateLineListIndices() {
		const { vertexCount, longitudes, latitudes } = this;

		const northPoleIndex = 0;
		const southPoleIndex = vertexCount - 1;

		const firstLatitudeStartIndex = 1;
		const lastLatitudeStartIndex = southPoleIndex - longitudes;

		const indices: number[] = [];

		for (let i = 0; i < longitudes; i++) {
			const A = northPoleIndex;
			const B = firstLatitudeStartIndex + i;
			const C = firstLatitudeStartIndex + ((i + 1) % longitudes);

			indices.push(A, B, B, C);
		}

		for (let j = 1; j < latitudes - 1; j++) {
			const previousLatitudeStartIndex = (j - 1) * longitudes + 1;
			const currentLatitudeStartIndex = previousLatitudeStartIndex + longitudes;

			for (let i = 0; i < longitudes; i++) {
				const currentLongitudeIndex = i;
				const nextLongitudeIndex = (i + 1) % longitudes;

				const A = previousLatitudeStartIndex + currentLongitudeIndex;
				const B = currentLatitudeStartIndex + currentLongitudeIndex;
				const C = currentLatitudeStartIndex + nextLongitudeIndex;

				indices.push(A, B, B, C, C, A);
			}
		}

		for (let i = 0; i < longitudes; i++) {
			const A = southPoleIndex;
			const B = lastLatitudeStartIndex + i;
			const C = lastLatitudeStartIndex + ((i + 1) % longitudes);

			indices.push(A, B, B, C);
		}

		return indices;
	}

	protected _generateLineStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleListIndices() {
		const { vertexCount, longitudes, latitudes } = this;

		const northPoleIndex = 0;
		const southPoleIndex = vertexCount - 1;

		const firstLatitudeStartIndex = 1;
		const lastLatitudeStartIndex = southPoleIndex - longitudes;

		const indices: number[] = [];

		for (let i = 0; i < longitudes; i++) {
			const A = northPoleIndex;
			const B = firstLatitudeStartIndex + i;
			const C = firstLatitudeStartIndex + ((i + 1) % longitudes);

			indices.push(A, B, C);
		}

		for (let j = 1; j < latitudes - 1; j++) {
			const previousLatitudeStartIndex = (j - 1) * longitudes + 1;
			const currentLatitudeStartIndex = previousLatitudeStartIndex + longitudes;

			for (let i = 0; i < longitudes; i++) {
				const currentLongitudeIndex = i;
				const nextLongitudeIndex = (i + 1) % longitudes;

				const A = previousLatitudeStartIndex + currentLongitudeIndex;
				const B = currentLatitudeStartIndex + currentLongitudeIndex;
				const C = currentLatitudeStartIndex + nextLongitudeIndex;
				const D = previousLatitudeStartIndex + nextLongitudeIndex;

				indices.push(A, B, C, A, C, D);
			}
		}

		for (let i = 0; i < longitudes; i++) {
			const A = southPoleIndex;
			const B = lastLatitudeStartIndex + i;
			const C = lastLatitudeStartIndex + ((i + 1) % longitudes);

			indices.push(A, B, C);
		}

		return indices;
	}

	protected _generateTriangleStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	setRadius(radius: number) {
		this.radius = radius;

		return this;
	}

	setLongitudes(longitudes: number) {
		this.longitudes = longitudes;

		return this;
	}

	setLatitudes(latitudes: number) {
		this.latitudes = latitudes;

		return this;
	}

	set(radius: number, longitudes: number, latitudes: number) {
		this._radius = radius;
		this._longitudes = longitudes;
		this._latitudes = latitudes;

		this._updateVertices();

		return this;
	}
}

export default SphereGeometry;
