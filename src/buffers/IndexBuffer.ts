import Buffer from './Buffer';

class IndexBuffer extends Buffer {
    constructor(size: number, usage: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage: number, mappedAtCreation?: boolean);
    constructor(input: any, usage: number, mappedAtCreation?: boolean) {
        super(input, GPUBufferUsage.INDEX | usage, mappedAtCreation);
    }
}

export default IndexBuffer;
