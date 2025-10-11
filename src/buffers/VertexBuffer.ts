import Buffer from './Buffer';

class VertexBuffer extends Buffer {
	constructor(size: number, usage?: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage?: number, mappedAtCreation?: boolean);
	// biome-ignore lint/suspicious/noExplicitAny: Argument of type 'unknown' is not assignable either to parameter of type 'number' or 'BufferSource'.
	constructor(input: any, usage = 0, mappedAtCreation?: boolean) {
		super(input, GPUBufferUsage.VERTEX | usage, mappedAtCreation);
	}
}

export default VertexBuffer;
