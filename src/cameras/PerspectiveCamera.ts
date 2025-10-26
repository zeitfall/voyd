import { GPUContext } from '~/core';
import { UniformBuffer } from '~/buffers';
import { Matrix4, Vector3 } from '~/math';
import { toRadians } from '~/utils';

const _up = new Vector3(0, 1, 0);

// https://perry.cz/articles/ProjectionMatrix.xhtml
class PerspectiveCamera {
	#position: Vector3;
	#target: Vector3;
	#right: Vector3;
	#up: Vector3;
	#forward: Vector3;

	#projectionMatrix: Matrix4;
	#viewMatrix: Matrix4;

	#projectionMatrixArray: Float32Array<ArrayBuffer>;
	#viewMatrixArray: Float32Array<ArrayBuffer>;

	#projectionMatrixBuffer: UniformBuffer;
	#viewMatrixBuffer: UniformBuffer;

	constructor(
		public fovy = 80,
		public aspectRatio = 1,
		public nearPlane = 0.1,
		public farPlane = 128,
	) {
		this.#position = new Vector3(0, 0, -1);
		this.#target = new Vector3();
		this.#right = new Vector3();
		this.#up = new Vector3();
		this.#forward = new Vector3();

		this.#projectionMatrix = Matrix4.identity();
		this.#viewMatrix = Matrix4.identity();

		this.#projectionMatrixArray = new Float32Array(this.#projectionMatrix.elements);
		this.#viewMatrixArray = new Float32Array(this.#viewMatrix.elements);

		this.#projectionMatrixBuffer = new UniformBuffer(this.#projectionMatrixArray, GPUBufferUsage.COPY_DST);
		this.#viewMatrixBuffer = new UniformBuffer(this.#viewMatrixArray, GPUBufferUsage.COPY_DST);

		this.update();
	}

	get position() {
		return this.#position;
	}

	get target() {
		return this.#target;
	}

	get projectionMatrix() {
		return this.#projectionMatrix;
	}

	get viewMatrix() {
		return this.#viewMatrix;
	}

	get projectionMatrixBuffer() {
		return this.#projectionMatrixBuffer;
	}

	get viewMatrixBuffer() {
		return this.#viewMatrixBuffer;
	}

	#updateProjection() {
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
		this.#projectionMatrix.set(
            A, 0, 0, 0,
            0, B, 0, 0,
            0, 0, C, D,
            0, 0, E, 0,
        );

		this.#projectionMatrixArray.set(this.#projectionMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.#projectionMatrixBuffer.instance, 0, this.#projectionMatrixArray.buffer, 0);
	}

	#updateView() {
		const p = this.#position;
		const t = this.#target;
		const r = this.#right;
		const u = this.#up;
		const f = this.#forward;
		const up = _up;

		f.copy(t).subtract(p).normalize();
		r.copy(up).cross(f).normalize();
		u.copy(f).cross(r).normalize();

		const A = -p.dot(r);
		const B = -p.dot(u);
		const C = -p.dot(f);

		// biome-ignore format: It's easier to distinguish matrix columns.
		this.#viewMatrix.set(
            r.x, u.x, f.x, 0,
            r.y, u.y, f.y, 0,
            r.z, u.z, f.z, 0,
            A, B, C, 1
        );

		this.#viewMatrixArray.set(this.#viewMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.#viewMatrixBuffer.instance, 0, this.#viewMatrixArray.buffer, 0);
	}

	setAspectRatio(value: number) {
		this.aspectRatio = value;

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

	update() {
		this.#updateProjection();
		this.#updateView();
	}
}

export default PerspectiveCamera;
