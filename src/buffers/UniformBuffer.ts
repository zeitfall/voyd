import Buffer from './Buffer';

import type { BufferSource } from '~/types';

class UniformBuffer extends Buffer {
	constructor(size: number, usage?: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage?: number, mappedAtCreation?: boolean);
	// biome-ignore lint/suspicious/noExplicitAny: Argument of type 'unknown' is not assignable either to parameter of type 'number' or 'BufferSource'.
	constructor(input: any, usage = 0, mappedAtCreation?: boolean) {
		super(input, GPUBufferUsage.UNIFORM | usage, mappedAtCreation);
	}
}

export default UniformBuffer;
