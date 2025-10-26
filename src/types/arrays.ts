export type ArrayOf<T, L, A extends T[] = []> = A['length'] extends L ? A : ArrayOf<T, L, [...A, T]>;

export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array;
