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

		const projectionMatrix = Matrix4.identity();
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

	setAspectRatio(value: number) {
		this.aspectRatio = value;

		return this;
	}

	override update() {
		super.update();

		this.#updateProjection();
	}

	#updateProjection() {
		const fovy = this.fovy;
		const ar = this.aspectRatio;
		const np = this.nearPlane;
		const fp = this.farPlane;

		const projectionMatrix = this.#projectionMatrix;
		const projectionMatrixArray = this.#projectionMatrixArray;
		const projectionMatrixBuffer = this.#projectionMatrixBuffer;

		const fn = fp - np;
		const it = 1 / Math.tan(toRadians(fovy / 2));

		const A = it / ar;
		const B = it;
		const C = fp / fn;
		const D = 1;
		const E = -(np * fp) / fn;

		// biome-ignore format: It's easier to distinguish matrix columns.
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
