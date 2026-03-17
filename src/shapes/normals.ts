import { Vector3 } from '~/math';

// https://gamemath.com/book/graphics.html#surface_normals
function computeTriangleListNormals(vertices: Float32Array, indices: Uint16Array) {
    const vertexCount = vertices.length / 3;
    const indexCount = indices.length;

    const normals = new Float32Array(vertices.length);

    const vertexA = new Vector3();
    const vertexB = new Vector3();
    const vertexC = new Vector3();

    const tempEdgeA = new Vector3();
    const tempEdgeB = new Vector3();
    const tempNormal = new Vector3();

    for (let i = 0; i < indexCount; i += 3) {
        const vertexAOffset = 3 * indices[i];
        const vertexBOffset = 3 * indices[i + 1];
        const vertexCOffset = 3 * indices[i + 2];

        const vertexAXIndex = vertexAOffset;
        const vertexAYIndex = vertexAOffset + 1;
        const vertexAZIndex = vertexAOffset + 2;

        const vertexBXIndex = vertexBOffset;
        const vertexBYIndex = vertexBOffset + 1;
        const vertexBZIndex = vertexBOffset + 2;

        const vertexCXIndex = vertexCOffset;
        const vertexCYIndex = vertexCOffset + 1;
        const vertexCZIndex = vertexCOffset + 2;

        vertexA.set(vertices[vertexAXIndex], vertices[vertexAYIndex], vertices[vertexAZIndex]);
        vertexB.set(vertices[vertexBXIndex], vertices[vertexBYIndex], vertices[vertexBZIndex]);
        vertexC.set(vertices[vertexCXIndex], vertices[vertexCYIndex], vertices[vertexCZIndex]);

        tempEdgeA.copy(vertexB).subtract(vertexA);
        tempEdgeB.copy(vertexC).subtract(vertexA);

        tempNormal.copy(tempEdgeB).cross(tempEdgeA);

        normals[vertexAXIndex] += tempNormal.x;
        normals[vertexAYIndex] += tempNormal.y;
        normals[vertexAZIndex] += tempNormal.z;

        normals[vertexBXIndex] += tempNormal.x;
        normals[vertexBYIndex] += tempNormal.y;
        normals[vertexBZIndex] += tempNormal.z;

        normals[vertexCXIndex] += tempNormal.x;
        normals[vertexCYIndex] += tempNormal.y;
        normals[vertexCZIndex] += tempNormal.z;
    }

    for (let i = 0; i < vertexCount; i++) {
        const i0 = 3 * i;
        const i1 = i0 + 1;
        const i2 = i1 + 1;

        tempNormal.set(normals[i0], normals[i1], normals[i2]);

        if (tempNormal.lengthSquared > 0) {
            tempNormal.normalize();

            normals[i0] = tempNormal.x;
            normals[i1] = tempNormal.y;
            normals[i2] = tempNormal.z;
        }
    }

    return normals;
}

export {
    computeTriangleListNormals
};
