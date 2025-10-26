import { Vector } from '~/math';

import type { TypedArray } from '~/types';

export function isArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value);
}

export function isArrayOfNumbers(value: unknown): value is number[] {
	return isArray(value) && value.every((element) => typeof element === 'number');
}

export function isArrayOfVectors(value: unknown): value is Vector[] {
	return isArray(value) && value.every((element) => element instanceof Vector);
}

export function isTypedArray(value: unknown): value is TypedArray {
	return ArrayBuffer.isView(value) && !(value instanceof DataView);
}
