import { GPUContext } from '~/core';
import { UniformBuffer } from '~/buffers';
import { Matrix4, Vector3 } from '~/math';

abstract class Camera {
	static #DEFAULT_RIGHT: Readonly<Vector3>;
	static #DEFAULT_UP: Readonly<Vector3>;
	static #DEFAULT_FORWARD: Readonly<Vector3>;

	static {
		const right = new Vector3(1, 0, 0);
		const up = new Vector3(0, 1, 0);
		const forward = new Vector3(0, 0, 1);

		Object.freeze(right);
		Object.freeze(up);
		Object.freeze(forward);

		this.#DEFAULT_RIGHT = right;
		this.#DEFAULT_UP = up;
		this.#DEFAULT_FORWARD = forward;
	}

	static get DEFAULT_RIGHT() {
		return this.#DEFAULT_RIGHT;
	}

	static get DEFAULT_UP() {
		return this.#DEFAULT_UP;
	}

	static get DEFAULT_FORWARD() {
		return this.#DEFAULT_FORWARD;
	}

	#position: Vector3;
	#target: Vector3;
	#right: Vector3;
	#up: Vector3;
	#forward: Vector3;

	#viewMatrix: Matrix4;
	#viewMatrixArray: Float32Array;
	#viewMatrixBuffer: UniformBuffer;

	constructor(public nearPlane = 0.1, public farPlane = 128) {
		const position = new Vector3(0, 0, -1);
		const target = new Vector3();
		const right = new Vector3();
		const up = new Vector3();
		const forward = new Vector3();

		const viewMatrix = Matrix4.identity();
		const viewMatrixArray = new Float32Array(viewMatrix.elements);
		const viewMatrixBuffer = new UniformBuffer(viewMatrixArray, GPUBufferUsage.COPY_DST);

		this.#position = position;
		this.#target = target;
		this.#right = right;
		this.#up = up;
		this.#forward = forward;

		this.#viewMatrix = viewMatrix;
		this.#viewMatrixArray = viewMatrixArray;
		this.#viewMatrixBuffer = viewMatrixBuffer;
	}

	get position() {
		return this.#position;
	}

	get target() {
		return this.#target;
	}

	get right() {
		return this.#right;
	}

	get up() {
		return this.#up;
	}

	get forward() {
		return this.#forward;
	}

	get viewMatrix() {
		return this.#viewMatrix;
	}

	get viewMatrixBuffer() {
		return this.#viewMatrixBuffer;
	}

	abstract get projectionMatrix(): Matrix4;

	abstract get projectionMatrixBuffer(): UniformBuffer;

	setNearPlane(value: number) {
		this.nearPlane = value;

		return this;
	}

	setFarPlane(value: number) {
		this.farPlane = value;

		return this;
	}

	update() {
		this.#updateView();
	}

	abstract setAspectRatio(ratio: number): this;

	#updateView() {
		const position = this.#position;
		const target = this.#target;
		const right = this.#right;
		const up = this.#up;
		const forward = this.#forward;

		const viewMatrix = this.#viewMatrix;
		const viewMatrixArray = this.#viewMatrixArray;

		forward.copy(target).directionFrom(position).normalize();
		right.copy(Camera.DEFAULT_UP).cross(forward).normalize();
		up.copy(forward).cross(right).normalize();

		const translateX = -position.dot(right);
		const translateY = -position.dot(up);
		const translateZ = -position.dot(forward);

		// biome-ignore format: It's easier to distinguish matrix columns.
		viewMatrix.set(
            right.x, up.x, forward.x, 0,
            right.y, up.y, forward.y, 0,
            right.z, up.z, forward.z, 0,
            translateX, translateY, translateZ, 1
        );

		viewMatrixArray.set(viewMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.viewMatrixBuffer.instance, 0, viewMatrixArray.buffer, 0);
	}
}

export default Camera;
