import { Vector3 } from '~/math';

import { PI, TWO_PI } from '~/constants';

const MIN_LATITUDE_COUNT = 2;
const MIN_LONGITUDE_COUNT = 3;

const DEFAULT_RADIUS = 1;
const DEFAULT_LATITUDE_COUNT = 8;
const DEFAULT_LONGITUDE_COUNT = 8;

function generateSphereVertices(
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

    const vertices = new Float32Array(3 * vertexCount);
    // const normals = new Float32Array(3 * vertexCount);
    // const uvs = new Float32Array(2 * vertexCount);

    let vertexIndex = 0;
    // let normalIndex = 0;
    // let uvIndex = 0;

    const tempVertex = new Vector3();

    for (let j = 0; j <= latitudeCount; j++) {
        const phi = j * latitudeAngle;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // const v = 1 - j / latitudeAngle;

        for (let i = 0; i <= longitudeCount; i++) {
            const theta = i * longitudeAngle;

            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            // const u = i / longitudeCount;

            tempVertex.set(
                radius * sinPhi * cosTheta,
                radius * cosPhi,
                radius * sinPhi * sinTheta
            );

            vertices[vertexIndex++] = tempVertex.x;
            vertices[vertexIndex++] = tempVertex.y;
            vertices[vertexIndex++] = tempVertex.z;

            // tempVertex.normalize();

            // normals[normalIndex++] = tempVertex.x;
            // normals[normalIndex++] = tempVertex.y;
            // normals[normalIndex++] = tempVertex.z;

            // uvs[uvIndex++] = u;
            // uvs[uvIndex++] = v;
        }
    }

    return vertices;

    // return {
    //     positions,
    //     normals,
    //     uvs
    // };
}

export default generateSphereVertices;
