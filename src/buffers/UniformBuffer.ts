import Buffer from './Buffer';

class UniformBuffer extends Buffer {
    constructor(size: number, usage: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage: number, mappedAtCreation?: boolean);
    constructor(input: any, usage: number, mappedAtCreation?: boolean) {
        super(input, GPUBufferUsage.UNIFORM | usage, mappedAtCreation);
    }
}

export default UniformBuffer;
