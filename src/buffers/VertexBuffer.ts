import Buffer from './Buffer';

class VertexBuffer extends Buffer {
    constructor(size: number, usage: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage: number, mappedAtCreation?: boolean);
    constructor(input: any, usage: number, mappedAtCreation?: boolean) {
        super(input, GPUBufferUsage.VERTEX | usage, mappedAtCreation);
    }
}

export default VertexBuffer;
