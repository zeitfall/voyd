import Buffer from './Buffer';

import type { BufferSource } from '~/types';

class IndexBuffer extends Buffer {
	constructor(size: number, usage?: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage?: number, mappedAtCreation?: boolean);
	constructor(input: any, usage = 0, mappedAtCreation?: boolean) {
		super(input, GPUBufferUsage.INDEX | usage, mappedAtCreation);
	}
}

export default IndexBuffer;
