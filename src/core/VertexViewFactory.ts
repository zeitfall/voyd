import type { Constructor, TypedArray, VertexViewMap } from '~/types';

class VertexViewFactory {

    static create<F extends GPUVertexFormat>(format: F, buffer?: ArrayBuffer, byteOffset?: number) {

        const instantiate = (
            Constructor: Constructor<TypedArray>,
            buffer?: ArrayBuffer,
            byteOffset = 0
        ) => {
            if (buffer) {
                return new Constructor(buffer, byteOffset) as VertexViewMap[F];
            }

            return new Constructor() as VertexViewMap[F];
        }

        switch (format) {
            case 'uint8':
            case 'uint8x2':
            case 'uint8x4':
            case 'unorm8':
            case 'unorm8x2':
            case 'unorm8x4':
            case 'unorm8x4-bgra':
                return instantiate(Uint8Array, buffer, byteOffset);

            case 'uint16':
            case 'uint16x2':
            case 'uint16x4':
            case 'unorm16':
            case 'unorm16x2':
            case 'unorm16x4':
                return instantiate(Uint16Array, buffer, byteOffset);

            case 'uint32':
            case 'uint32x2':
            case 'uint32x3':
            case 'uint32x4':
                return instantiate(Uint32Array, buffer, byteOffset);

            case 'sint8':
            case 'sint8x2':
            case 'sint8x4':
            case 'snorm8':
            case 'snorm8x2':
            case 'snorm8x4':
                return instantiate(Int8Array, buffer, byteOffset);

            case 'sint16':
            case 'sint16x2':
            case 'sint16x4':
            case 'snorm16':
            case 'snorm16x2':
            case 'snorm16x4':
                return instantiate(Int16Array, buffer, byteOffset);

            case 'sint32':
            case 'sint32x2':
            case 'sint32x3':
            case 'sint32x4':
                return instantiate(Int32Array, buffer, byteOffset);
            
            case 'float16':
            case 'float16x2':
            case 'float16x4':
                return instantiate(Float16Array, buffer, byteOffset);

            case 'float32':
            case 'float32x2':
            case 'float32x3':
            case 'float32x4':
                return instantiate(Float32Array, buffer, byteOffset);

            default:
                throw new Error(`[VertexViewFactory]: Unsupported format "${format}" was given.`);
        }
    }
}

export default VertexViewFactory;
