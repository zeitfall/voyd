import Camera from './Camera';

import { GPUContext } from '~/core';
import { Matrix4 } from '~/math';

import { createUniformBuffer } from '~/utils';

class OrthographicCamera extends Camera {
	#projectionMatrix: Matrix4;
	#projectionMatrixArray: Float32Array;
	#projectionMatrixBuffer: GPUBuffer;

	constructor(
		public leftPlane = -1,
		public rightPlane = 1,
		public topPlane = 1,
		public bottomPlane = -1,
		nearPlane?: number,
		farPlane?: number,
	) {
		super(nearPlane, farPlane);

		const projectionMatrix = new Matrix4();
		const projectionMatrixArray = new Float32Array(projectionMatrix.elements);
		const projectionMatrixBuffer = createUniformBuffer(projectionMatrixArray, GPUBufferUsage.COPY_DST);

		this.#projectionMatrix = projectionMatrix;
		this.#projectionMatrixArray = projectionMatrixArray;
		this.#projectionMatrixBuffer = projectionMatrixBuffer;

		this.update();
	}

	get projectionMatrix() {
		return this.#projectionMatrix;
	}

	get projectionMatrixBuffer() {
		return this.#projectionMatrixBuffer;
	}

	setLeftPlane(value: number) {
		this.leftPlane = value;

		return this;
	}

	setRightPlane(value: number) {
		this.rightPlane = value;

		return this;
	}

	setTopPlane(value: number) {
		this.topPlane = value;

		return this;
	}

	setBottomPlane(value: number) {
		this.bottomPlane = value;

		return this;
	}

	setPlanes(left: number, right: number, top: number, bottom: number, near: number, far: number) {
		return this.setLeftPlane(left)
			.setRightPlane(right)
			.setTopPlane(top)
			.setBottomPlane(bottom)
			.setNearPlane(near)
			.setFarPlane(far);
	}

	setAspectRatio(ratio: number) {
        const height = Math.abs(this.topPlane - this.bottomPlane);
        const width = height * ratio;
        const halfWidth = width / 2;

		return this.setLeftPlane(-halfWidth).setRightPlane(halfWidth);
    }

	override update() {
		super.update();

		this.#updateProjectionMatrix();
	}

	#updateProjectionMatrix() {
		const {
			leftPlane,
			rightPlane,
			topPlane,
			bottomPlane,
			nearPlane,
			farPlane
		} = this;

		const projectionMatrix = this.#projectionMatrix;
		const projectionMatrixArray = this.#projectionMatrixArray;
		const projectionMatrixBuffer = this.#projectionMatrixBuffer;

		const width = rightPlane - leftPlane;
		const height = topPlane - bottomPlane;
		const depth = farPlane - nearPlane;

		const A = 2 / width;
		const B = 2 / height;
		const C = 1 / depth;
		const D = -(rightPlane + leftPlane) / width;
		const E = -(topPlane + bottomPlane) / height;
		const F = -nearPlane / depth;
		const G = 1;

		projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, 0,
            D, E, F, G,
        );

		projectionMatrixArray.set(projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(projectionMatrixBuffer, 0, projectionMatrixArray.buffer, 0);
	}
}

export default OrthographicCamera;
