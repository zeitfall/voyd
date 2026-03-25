import Camera from './Camera';

import { Matrix4, toRadians } from '~/math';

// https://perry.cz/articles/ProjectionMatrix.xhtml
class PerspectiveCamera extends Camera {
	#projectionMatrix: Matrix4;

	constructor(
		public fov = 80,
		public aspectRatio = 1,
		nearPlane?: number,
		farPlane?: number,
	) {
		super(nearPlane, farPlane);

		this.#projectionMatrix = new Matrix4();

		this.update();
	}

	get projectionMatrix() {
		return this.#projectionMatrix;
	}

	setFOV(value: number) {
		this.fov = value;

		return this;
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
		const { fov, aspectRatio, nearPlane, farPlane } = this;

		const projectionMatrix = this.#projectionMatrix;

		const depth = farPlane - nearPlane;
		const inverseTan = 1 / Math.tan(toRadians(fov / 2));

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
	}
}

export default PerspectiveCamera;
