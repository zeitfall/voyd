import Camera from './Camera';

import { GPUContext } from '~/core';
import { toRadians } from '~/utils';

// https://perry.cz/articles/ProjectionMatrix.xhtml
class PerspectiveCamera extends Camera {
	constructor(
		public fovy = 80,
		public aspectRatio = 1,
		nearPlane?: number,
		farPlane?: number,
	) {
		super(nearPlane, farPlane);
	}

	protected _updateProjection() {
		const fovy = this.fovy;
		const ar = this.aspectRatio;
		const np = this.nearPlane;
		const fp = this.farPlane;

		const fn = fp - np;
		const it = 1 / Math.tan(toRadians(fovy / 2));

		const A = it / ar;
		const B = it;
		const C = fp / fn;
		const D = 1;
		const E = -(np * fp) / fn;

		// biome-ignore format: It's easier to distinguish matrix columns.
		this.projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, D,
            0, 0, E, 0,
        );

		this.projectionMatrixArray.set(this.projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.projectionMatrixBuffer.instance, 0, this.projectionMatrixArray.buffer, 0);
	}

	setAspectRatio(value: number) {
		this.aspectRatio = value;

		return this;
	}
}

export default PerspectiveCamera;
