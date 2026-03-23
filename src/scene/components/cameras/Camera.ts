import SceneComponent from '../SceneComponent';

import { Matrix4 } from '~/math';

abstract class Camera extends SceneComponent {
    #viewMatrix: Matrix4;

    constructor(public nearPlane = 0.1, public farPlane = 128) {
        super();

		this.#viewMatrix = new Matrix4();
    }

	get viewMatrix() {
		return this.#viewMatrix;
	}

	abstract get projectionMatrix(): Matrix4;

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

        if (node) {
            viewMatrix.copy(node.transform.worldMatrix).inverse();
        }
        else {
            viewMatrix.identity();
        }
    }
}

export default Camera;
