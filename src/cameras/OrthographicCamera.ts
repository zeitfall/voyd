import Camera from './Camera';

import { GPUContext } from '~/core';

class OrthographicCamera extends Camera {
	constructor(
		public leftPlane = -1,
		public rightPlane = 1,
		public topPlane = 1,
		public bottomPlane = -1,
		public nearPlane = 0.1,
		public farPlane = 128,
	) {
		super();
	}

	protected _updateProjection() {
		const lp = this.leftPlane;
		const rp = this.rightPlane;
		const tp = this.topPlane;
		const bp = this.bottomPlane;
		const np = this.nearPlane;
		const fp = this.farPlane;

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
		this.projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, D,
            D, E, F, G,
        );

		this.projectionMatrixArray.set(this.projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.projectionMatrixBuffer.instance, 0, this.projectionMatrixArray.buffer, 0);
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

	setNearPlane(value: number) {
		this.nearPlane = value;

		return this;
	}

	setFarPlane(value: number) {
		this.farPlane = value;

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
}

export default OrthographicCamera;
