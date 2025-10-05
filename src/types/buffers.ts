export type TypedArrayConstructors =
	| Int8ArrayConstructor
	| Uint8ArrayConstructor
	| Uint8ClampedArrayConstructor
	| Int32ArrayConstructor
	| Uint32ArrayConstructor
	| Float32ArrayConstructor;

export type TypedArray = InstanceType<TypedArrayConstructors>;
