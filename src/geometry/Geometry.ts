import { createVertexBuffer } from '~/utils';

import { VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

import type { BufferAttribute } from '~/types';

class Geometry {
    #attributes: Map<string, BufferAttribute>;
    #vertexBuffers: Map<BufferAttribute, GPUBuffer>;
    #vertexBufferLayouts: Map<BufferAttribute, GPUVertexBufferLayout>;

    constructor() {
        this.#attributes = new Map();
        this.#vertexBuffers = new Map();
        this.#vertexBufferLayouts = new Map();
    }

    get vertexBuffers() {
        return this.#vertexBuffers;
    }

    get vertexBufferLayouts() {
        return this.#vertexBufferLayouts;
    }

    setAttribute(name: string, attribute: BufferAttribute) {
        const vertexBuffer = createVertexBuffer(attribute.data, GPUBufferUsage.COPY_DST);
        const vertexBufferLayout = this.#createVertexBufferLayout(attribute);

        this.#attributes.set(name, attribute);
        this.#vertexBuffers.set(attribute, vertexBuffer);
        this.#vertexBufferLayouts.set(attribute, vertexBufferLayout);

        return this;
    }

    removeAttribute(name: string) {
        const attributes = this.#attributes;
        const vertexBuffers = this.#vertexBuffers;
        const vertexBufferLayouts = this.#vertexBufferLayouts;

        const attribute = this.#attributes.get(name);

        if (attribute) {
            const vertexBuffer = vertexBuffers.get(attribute);

            if (vertexBuffer) {
                vertexBuffer.destroy();
                vertexBuffers.delete(attribute);
            }

            vertexBufferLayouts.delete(attribute);
        }

        attributes.delete(name);
    }

    hasAttribute(name: string) {
        return this.#attributes.has(name);
    }

    #createVertexBufferLayout(attribute: BufferAttribute): GPUVertexBufferLayout {
        let offset = 0;
        const layoutAttributes: GPUVertexAttribute[] = [];

        attribute.layout.forEach((format, index) => {
            layoutAttributes.push({
                shaderLocation: index,
                offset,
                format
            });

            offset += VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[format];
        });

        return {
            stepMode: 'vertex',
            arrayStride: attribute.byteStride,
            attributes: layoutAttributes
        };
    }
}

export default Geometry;
