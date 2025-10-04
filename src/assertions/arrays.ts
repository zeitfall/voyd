import { Vector } from '~/math';

export function isArray<T = unknown>(value: unknown): value is T[] {
	return Array.isArray(value);
}

export function isArrayOfNumbers(value: unknown): value is number[] {
	return isArray(value) && value.every((element) => typeof element === 'number');
}

export function isArrayOfVectors(value: unknown): value is Vector[] {
	return isArray(value) && value.every((element) => element instanceof Vector);
}
