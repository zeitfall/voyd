import type { Tuple } from './utils';

export type TypedArrayConstructors =
	| Int8ArrayConstructor
	| Uint8ArrayConstructor
	| Uint8ClampedArrayConstructor
	| Int32ArrayConstructor
	| Uint32ArrayConstructor
	| Float32ArrayConstructor;

export type TypedArray = InstanceType<TypedArrayConstructors>;

export type VertexAttributeNames = Tuple<'position' | 'normal' | 'uv'>;
