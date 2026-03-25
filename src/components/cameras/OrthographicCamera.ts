import Camera from './Camera';

import { Matrix4 } from '~/math';

class OrthographicCamera extends Camera {
	#projectionMatrix: Matrix4;

	constructor(
		public leftPlane = -1,
		public rightPlane = 1,
		public topPlane = 1,
		public bottomPlane = -1,
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
	}
}

export default OrthographicCamera;
