import { GPUContext, Instance } from '~/core';

import { isArrayBuffer, isBufferSource } from '~/assertions';

class Buffer extends Instance<GPUBuffer> {
	constructor(size: number, usage: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage: number, mappedAtCreation?: boolean);
	constructor(input: unknown, usage: number, mappedAtCreation = false) {
        let size;

        const isInputBufferSource = isBufferSource(input);

        if (isInputBufferSource) {
            size = input.byteLength;
        }
        else if (typeof input === 'number') {
            size = input;
        }
        else {
            throw new Error('[Buffer]: Invalid buffer input.');
        }

		const instance = GPUContext.device.createBuffer({
			size,
			usage,
			mappedAtCreation,
		});

        if (mappedAtCreation && isInputBufferSource) {
            const arrayBuffer = instance.getMappedRange();
            const arrayBufferView = new Uint8Array(arrayBuffer);
            
            const sourceData = isArrayBuffer(input)
                ? new Uint8Array(input)
                : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);

            arrayBufferView.set(sourceData);            

            instance.unmap();
        }

		super(instance);
	}

    get label() {
        return this.instance.label
    }

    get size() {
        return this.instance.size;
    }

    get usage() {
        return this.instance.usage;
    }

    get mapState() {
        return this.instance.mapState;
    }

    getMappedRange(offset?: number, size?: number) {
        return this.instance.getMappedRange(offset, size);
    }

    mapAsync(mode: number, offset?: number, size?: number) {
        return this.instance.mapAsync(mode, offset, size);
    }

    destroy() {
        this.instance.destroy();
    }
}

export default Buffer;
