import { Vector3 } from '~/math';

import { PI, TWO_PI } from '~/constants';

const MIN_LATITUDE_COUNT = 2;
const MIN_LONGITUDE_COUNT = 3;

const DEFAULT_RADIUS = 1;
const DEFAULT_LATITUDE_COUNT = 8;
const DEFAULT_LONGITUDE_COUNT = 8;

function generateSphereVertexData(
    radius = DEFAULT_RADIUS,
    latitudeCount = DEFAULT_LATITUDE_COUNT,
    longitudeCount = DEFAULT_LONGITUDE_COUNT
) {
    if (latitudeCount < MIN_LATITUDE_COUNT) {
        throw new Error(`Sphere must have at least ${MIN_LATITUDE_COUNT} latitudes.`);
    }

    if (longitudeCount < MIN_LONGITUDE_COUNT) {
        throw new Error(`Sphere must have at least ${MIN_LONGITUDE_COUNT} longitudes.`);
    }

    const latitudeAngle = PI / latitudeCount;
    const longitudeAngle = TWO_PI / longitudeCount;

    const vertexCount = (latitudeCount + 1) * (longitudeCount + 1);

    const positions = new Float32Array(3 * vertexCount);
    const normals = new Float32Array(3 * vertexCount);
    const uvs = new Float32Array(2 * vertexCount);

    let positionIndex = 0;
    let normalIndex = 0;
    let uvIndex = 0;

    const tempPosition = new Vector3();

    for (let j = 0; j <= latitudeCount; j++) {
        const phi = j * latitudeAngle;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const v = 1 - j / latitudeAngle;

        for (let i = 0; i <= longitudeCount; i++) {
            const theta = i * longitudeAngle;

            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            const u = i / longitudeCount;

            tempPosition.set(
                radius * sinPhi * cosTheta,
                radius * cosPhi,
                radius * sinPhi * sinTheta
            );

            positions[positionIndex++] = tempPosition.x;
            positions[positionIndex++] = tempPosition.y;
            positions[positionIndex++] = tempPosition.z;

            tempPosition.normalize();

            normals[normalIndex++] = tempPosition.x;
            normals[normalIndex++] = tempPosition.y;
            normals[normalIndex++] = tempPosition.z;

            uvs[uvIndex++] = u;
            uvs[uvIndex++] = v;
        }
    }

    return {
        positions,
        normals,
        uvs
    };
}

export default generateSphereVertexData;
