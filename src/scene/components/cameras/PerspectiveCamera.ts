import Camera from './Camera';

import { GPUContext } from '~/core';
import { UniformBuffer } from '~/buffers';
import { Matrix4 } from '~/math';

import { toRadians } from '~/utils';

// https://perry.cz/articles/ProjectionMatrix.xhtml
class PerspectiveCamera extends Camera {
	#projectionMatrix: Matrix4;
	#projectionMatrixArray: Float32Array;
	#projectionMatrixBuffer: UniformBuffer;

	constructor(
		public fovy = 80,
		public aspectRatio = 1,
		nearPlane?: number,
		farPlane?: number,
	) {
		super(nearPlane, farPlane);

		const projectionMatrix = new Matrix4();
		const projectionMatrixArray = new Float32Array(projectionMatrix.elements);
		const projectionMatrixBuffer = new UniformBuffer(projectionMatrixArray, GPUBufferUsage.COPY_DST);

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

	setAspectRatio(ratio: number) {
		this.aspectRatio = ratio;

		return this;
	}

	override update() {
		super.update();

		this.#updateProjectionMatrix();
	}

	#updateProjectionMatrix() {
		const { fovy, aspectRatio, nearPlane, farPlane } = this;

		const projectionMatrix = this.#projectionMatrix;
		const projectionMatrixArray = this.#projectionMatrixArray;
		const projectionMatrixBuffer = this.#projectionMatrixBuffer;

		const depth = farPlane - nearPlane;
		const inverseTan = 1 / Math.tan(toRadians(fovy / 2));

		const A = inverseTan / aspectRatio;
		const B = inverseTan;
		const C = farPlane / depth;
		const D = 1;
		const E = -(nearPlane * farPlane) / depth;

		projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, D,
            0, 0, E, 0,
        );

		projectionMatrixArray.set(projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(projectionMatrixBuffer.instance, 0, projectionMatrixArray.buffer, 0);
	}
}

export default PerspectiveCamera;
