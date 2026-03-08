function generatePointListIndices(rowCount: number, columnCount: number) {
    const indexCount = (rowCount + 1) * (columnCount + 1);

    const indices = new Uint16Array(indexCount);

    for (let i = 0; i < indexCount; i++) {
        indices[i] = i;
    }

    return indices;
}

function generateLineListIndices(rowCount: number, columnCount: number) {
    const horizontalLines = (rowCount + 1) * columnCount;
    const verticalLines = rowCount * (columnCount + 1);

    const indexCount = 2 * (horizontalLines + verticalLines);
    const verticesPerRow = columnCount + 1;

    const indices = new Uint16Array(indexCount);

    let indexIndex = 0;

    for (let j = 0; j <= rowCount; j++) {
        const rowStartIndex = j * verticesPerRow;

        for (let i = 0; i < columnCount; i++) {
            const A = rowStartIndex + i;
            const B = A + 1;

            indices[indexIndex++] = A;
            indices[indexIndex++] = B;
        }
    }

    for (let j = 0; j < rowCount; j++) {
        const currentRowStartIndex = j * verticesPerRow;
        const nextRowStartIndex = currentRowStartIndex + verticesPerRow;

        for (let i = 0; i <= columnCount; i++) {
            const A = currentRowStartIndex + i;
            const B = nextRowStartIndex + i;

            indices[indexIndex++] = A;
            indices[indexIndex++] = B;
        }
    }

    return indices;
}

function generateTriangleListIndices(rowCount: number, columnCount: number) {
    const indexCount = 6 * rowCount * columnCount;
    const verticesPerRow = columnCount + 1;

    const indices = new Uint16Array(indexCount);

    let indexIndex = 0;

    for (let j = 0; j < rowCount; j++) {
        const currentRowStartIndex = j * verticesPerRow;
        const nextRowStartIndex = currentRowStartIndex + verticesPerRow;

        for (let i = 0; i < columnCount; i++) {
            const A = currentRowStartIndex + i;
            const B = A + 1;
            const C = nextRowStartIndex + i;
            const D = C + 1;

            indices[indexIndex++] = B;
            indices[indexIndex++] = A;
            indices[indexIndex++] = C;
            indices[indexIndex++] = B;
            indices[indexIndex++] = C;
            indices[indexIndex++] = D;
        }
    }

    return indices;
}

export {
    generatePointListIndices,
    generateLineListIndices,
    generateTriangleListIndices,
};
