import { isTypedArray } from './arrays';

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
	return Boolean(value) && value instanceof ArrayBuffer;
}

export function isBufferSource(value: unknown): value is BufferSource {
	return isArrayBuffer(value) || isTypedArray(value);
}
