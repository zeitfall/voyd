import Camera from './Camera';

import { GPUContext } from '~/core';
import { UniformBuffer } from '~/buffers';
import { Matrix4 } from '~/math';

class OrthographicCamera extends Camera {
	#projectionMatrix: Matrix4;
	#projectionMatrixArray: Float32Array;
	#projectionMatrixBuffer: UniformBuffer;

	constructor(
		public leftPlane = -1,
		public rightPlane = 1,
		public topPlane = 1,
		public bottomPlane = -1,
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

	override update() {
		super.update();

		this.#updateProjection();
	}

	#updateProjection() {
		const lp = this.leftPlane;
		const rp = this.rightPlane;
		const tp = this.topPlane;
		const bp = this.bottomPlane;
		const np = this.nearPlane;
		const fp = this.farPlane;

		const projectionMatrix = this.#projectionMatrix;
		const projectionMatrixArray = this.#projectionMatrixArray;
		const projectionMatrixBuffer = this.#projectionMatrixBuffer;

		const rl = rp - lp;
		const tb = tp - bp;
		const fn = fp - np;

		const A = 2 / rl;
		const B = 2 / tb;
		const C = 1 / fn;
		const D = -(rp + lp) / rl;
		const E = -(tp + bp) / tb;
		const F = -np / fn;
		const G = 1;

		// biome-ignore format: It's easier to distinguish matrix columns.
		projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, D,
            D, E, F, G,
        );

		projectionMatrixArray.set(projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(projectionMatrixBuffer.instance, 0, projectionMatrixArray.buffer, 0);
	}
}

export default OrthographicCamera;
