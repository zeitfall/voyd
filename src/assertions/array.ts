import type { TypedArray } from '~/types';

export function isArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value);
}

export function isTypedArray(value: unknown): value is TypedArray {
	return ArrayBuffer.isView(value) && !(value instanceof DataView);
}
