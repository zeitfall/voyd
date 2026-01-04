import Buffer from './Buffer';

import type { Geometry } from '~/geometries';
import type { BufferSource } from '~/types';

class VertexBuffer extends Buffer {
	static fromGeometry(geometry: Geometry, usage?: number, mappedAtCreation?: boolean) {
		const geometryByteLength = geometry.byteLength;
		const geometryByteStride = geometry.byteStride;

		const arrayBuffer = new ArrayBuffer(geometryByteLength);
		const arrayBufferView = new DataView(arrayBuffer);

		let attributeOffset = 0;

		geometry.attributes.forEach((attribute, attributeName) => {
			const attributeArrayConstructor = attribute.array.constructor;

			for (let i = 0; i < attribute.length; i++) {
				const item = attribute.getItem(i);
				const itemStartIndex = i * geometryByteStride;
				const itemBytesPerComponent = item.BYTES_PER_ELEMENT;

				for (let j = 0; j < item.length; j++) {
					const component = item[j];
					const componentOffset = j * itemBytesPerComponent;

					const byteOffset = itemStartIndex + attributeOffset + componentOffset;

					switch (attributeArrayConstructor) {
						case Int8Array:
							arrayBufferView.setInt8(byteOffset, component);

							break;

						case Uint8Array:
						case Uint8ClampedArray:
							arrayBufferView.setUint8(byteOffset, component);

							break;

						case Int32Array:
							arrayBufferView.setInt32(byteOffset, component, true);

							break;

						case Uint32Array:
							arrayBufferView.setUint32(byteOffset, component, true);

							break;

						case Float32Array:
							arrayBufferView.setFloat32(byteOffset, component, true);

							break;

						default:
							throw new Error(`[VertexBuffer]: The "${attributeName}" attribute has unsupported array type.`);
					}
				}
			}

			attributeOffset += attribute.byteStride;
		});

		return new VertexBuffer(arrayBuffer, usage, mappedAtCreation);
	}

	constructor(size: number, usage?: number, mappedAtCreation?: boolean);
	constructor(source: BufferSource, usage?: number, mappedAtCreation?: boolean);
	constructor(input: any, usage = 0, mappedAtCreation?: boolean) {
		super(input, GPUBufferUsage.VERTEX | usage, mappedAtCreation);
	}
}

export default VertexBuffer;
