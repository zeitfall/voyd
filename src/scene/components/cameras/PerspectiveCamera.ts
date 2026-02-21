import Camera from './Camera';

import { GPUContext } from '~/core';
import { Matrix4 } from '~/math';

import { createUniformBuffer, toRadians } from '~/utils';

// https://perry.cz/articles/ProjectionMatrix.xhtml
class PerspectiveCamera extends Camera {
	#projectionMatrix: Matrix4;
	#projectionMatrixBuffer: GPUBuffer;

	constructor(
		public fovy = 80,
		public aspectRatio = 1,
		nearPlane?: number,
		farPlane?: number,
	) {
		super(nearPlane, farPlane);

		const projectionMatrix = new Matrix4();
		const projectionMatrixBuffer = createUniformBuffer(projectionMatrix.array, GPUBufferUsage.COPY_DST);

		this.#projectionMatrix = projectionMatrix;
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

		GPUContext.device.queue.writeBuffer(projectionMatrixBuffer, 0, projectionMatrix.array.buffer, 0);
	}
}

export default PerspectiveCamera;
