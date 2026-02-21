import SceneComponent from '../SceneComponent';

import { GPUContext } from '~/core';
import { Matrix4 } from '~/math';

import { createUniformBuffer } from '~/utils';

abstract class Camera extends SceneComponent {
    #viewMatrix: Matrix4;
    #viewMatrixArray: Float32Array;
    #viewMatrixBuffer: GPUBuffer;

    constructor(public nearPlane = 0.1, public farPlane = 128) {
        super();

        const viewMatrix = new Matrix4();
        const viewMatrixArray = new Float32Array(viewMatrix.elements);
        const viewMatrixBuffer = createUniformBuffer(viewMatrixArray, GPUBufferUsage.COPY_DST);

		this.#viewMatrix = viewMatrix;
		this.#viewMatrixArray = viewMatrixArray;
		this.#viewMatrixBuffer = viewMatrixBuffer;
    }

	get viewMatrix() {
		return this.#viewMatrix;
	}

	get viewMatrixBuffer() {
		return this.#viewMatrixBuffer;
	}

	abstract get projectionMatrix(): Matrix4;

	abstract get projectionMatrixBuffer(): GPUBuffer;

	setNearPlane(value: number) {
		this.nearPlane = value;

		return this;
	}

	setFarPlane(value: number) {
		this.farPlane = value;

		return this;
	}

    update() {
        this.#updateViewMatrix();
    }

	abstract setAspectRatio(ratio: number): this;

    #updateViewMatrix() {
        const node = this.node;

        const viewMatrix = this.#viewMatrix;
        const viewMatrixArray = this.#viewMatrixArray;
        const viewMatrixBuffer = this.#viewMatrixBuffer;

        if (node) {
            viewMatrix.copy(node.transform.worldMatrix).inverse();
        }
        else {
            viewMatrix.identity();
        }

        viewMatrixArray.set(viewMatrix.elements);

        GPUContext.device.queue.writeBuffer(viewMatrixBuffer, 0, viewMatrixArray.buffer, 0);
    }
}

export default Camera;
