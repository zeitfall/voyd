import type { TypedArray } from '~/types';

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
	return Boolean(value) && value instanceof ArrayBuffer;
}

export function isTypedArray(value: unknown): value is TypedArray {
	return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isBufferSource(value: unknown): value is BufferSource {
	return isArrayBuffer(value) || isTypedArray(value);
}
