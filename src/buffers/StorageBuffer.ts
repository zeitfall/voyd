import Buffer from './Buffer';

class StorageBuffer extends Buffer {
    constructor(size: number, usage: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage: number, mappedAtCreation?: boolean);
    constructor(input: any, usage: number, mappedAtCreation?: boolean) {
        super(input, GPUBufferUsage.STORAGE | usage, mappedAtCreation);
    }
}

export default StorageBuffer;
