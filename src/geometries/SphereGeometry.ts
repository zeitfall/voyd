import Geometry from './Geometry';

import { TWO_PI } from '~/constants';

class SphereGeometry extends Geometry {
    constructor(public radius: number, public longitudes: number, public latitudes: number) {
        super();

        this._updateVertices();

        this.setTopology('triangle-list');
    }

    protected _generateVertexData() {
		const { radius, longitudes, latitudes } = this;

        const longitudeAngle = TWO_PI / longitudes;
        const latitudeAngle = Math.PI / latitudes;

        const vertices: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];

        vertices.push(0, radius, 0);
        normals.push(0, 1, 0);
        uvs.push(0, 0);

        for (let j = 1; j < latitudes; j++) {
            const phi = j * latitudeAngle;

            for (let i = 0; i < longitudes; i++) {
                const theta = i * longitudeAngle;

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);

                vertices.push(x, y, z);
                normals.push(0, 0, 0); // Figure out later
                uvs.push(0, 0); // Figure out later
            }
        }

        vertices.push(0, -radius, 0);
        normals.push(0, -1, 0);
        uvs.push(0, 0);

        return {
            vertices,
            normals,
            uvs
        };
    }

	protected _generateLineListIndices() {
		const indices: number[] = [];

        return indices;
	}

	protected _generateLineStripIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleListIndices() {
		const indices: number[] = [];

		return indices;
	}

	protected _generateTriangleStripIndices() {
		const indices: number[] = [];

		return indices;
	}
}

export default SphereGeometry;
