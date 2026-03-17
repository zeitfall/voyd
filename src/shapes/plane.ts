import { Vector3 } from '~/math';

const DEFAULT_WIDTH = 1;
const DEFAULT_HEIGHT = 1;
const DEFAULT_ROW_COUNT = 1;
const DEFAULT_COLUMN_COUNT = 1;

function generatePlaneVertices(
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    rowCount = DEFAULT_ROW_COUNT,
    columnCount = DEFAULT_COLUMN_COUNT
) {
    if (rowCount <= 0) {
        throw new Error(`Plane must have at least 1 row.`);
    }

    if (columnCount <= 0) {
        throw new Error(`Plane must have at least 1 column.`);
    }
 
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const cellWidth = width / columnCount;
    const cellHeight = height / rowCount;

    const vertexCount = (rowCount + 1) * (columnCount + 1);

    const vertices = new Float32Array(3 * vertexCount);
    // const normals = new Float32Array(3 * vertexCount);
    // const uvs = new Float32Array(2 * vertexCount);

    let vertexIndex = 0;
    // let normalIndex = 0;
    // let uvIndex = 0;

    const tempVertex = new Vector3();

    for (let j = 0; j <= rowCount; j++) {
        let y = j * cellHeight;
        // const v = 1 - j / rowCount;

        y -= halfHeight;

        for (let i = 0; i <= columnCount; i++) {
            let x = i * cellWidth;
            // const u = i / columnCount;

            x -= halfWidth;

            tempVertex.set(x, Math.random(), -y);
            // tempVertex.set(x, -y, 0);

            vertices[vertexIndex++] = tempVertex.x;
            vertices[vertexIndex++] = tempVertex.y;
            vertices[vertexIndex++] = tempVertex.z;

            tempVertex.normalize();

            // normals[normalIndex++] = tempVertex.x;
            // normals[normalIndex++] = tempVertex.y;
            // normals[normalIndex++] = tempVertex.z;

            // uvs[uvIndex++] = u;
            // uvs[uvIndex++] = v;
        }
    }

    return vertices;

    // return {
    //     vertices,
    //     normals,
    //     uvs
    // };
}

export default generatePlaneVertices;
