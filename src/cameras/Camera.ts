import { GPUContext } from '~/core';
import { UniformBuffer } from '~/buffers';
import { Matrix4, Vector3 } from '~/math';

import { defineReadOnlyProperties } from '~/utils';

abstract class Camera {
	declare static readonly DEFAULT_RIGHT: Readonly<Vector3>;
	declare static readonly DEFAULT_UP: Readonly<Vector3>;
	declare static readonly DEFAULT_FORWARD: Readonly<Vector3>;

	static {
		const DEFAULT_RIGHT = new Vector3(1, 0, 0);
		const DEFAULT_UP = new Vector3(0, 1, 0);
		const DEFAULT_FORWARD = new Vector3(0, 0, 1);

		Object.freeze(DEFAULT_RIGHT);
		Object.freeze(DEFAULT_UP);
		Object.freeze(DEFAULT_FORWARD);

		defineReadOnlyProperties(Camera, {
			DEFAULT_RIGHT,
			DEFAULT_UP,
			DEFAULT_FORWARD
		});
	}

	declare readonly position: Vector3;
	declare readonly target: Vector3;
	declare readonly right: Vector3;
	declare readonly up: Vector3;
	declare readonly forward: Vector3;

	declare readonly viewMatrix: Matrix4;
	declare readonly projectionMatrix: Matrix4;

	declare readonly viewMatrixArray: Float32Array;
	declare readonly projectionMatrixArray: Float32Array;

	declare readonly viewMatrixBuffer: UniformBuffer;
	declare readonly projectionMatrixBuffer: UniformBuffer;

	constructor(public nearPlane = 0.1, public farPlane = 128) {
		const position = new Vector3(0, 0, -1);
		const target = new Vector3();
		const right = new Vector3();
		const up = new Vector3();
		const forward = new Vector3();

		const viewMatrix = Matrix4.identity();
		const projectionMatrix = Matrix4.identity();

		const viewMatrixArray = new Float32Array(viewMatrix.elements);
		const projectionMatrixArray = new Float32Array(projectionMatrix.elements);

		const projectionMatrixBuffer = new UniformBuffer(projectionMatrixArray, GPUBufferUsage.COPY_DST);
		const viewMatrixBuffer = new UniformBuffer(viewMatrixArray, GPUBufferUsage.COPY_DST);

		defineReadOnlyProperties(this, {
			position,
			target,
			right,
			up,
			forward,
			viewMatrix,
			projectionMatrix,
			viewMatrixArray,
			projectionMatrixArray,
			viewMatrixBuffer,
			projectionMatrixBuffer,
		});

		this.update();
	}

	private _updateView() {
		const p = this.position;
		const t = this.target;
		const r = this.right;
		const u = this.up;
		const f = this.forward;

		f.copy(t).subtract(p).normalize();
		r.copy(Camera.DEFAULT_UP).cross(f).normalize();
		u.copy(f).cross(r).normalize();

		const A = -p.dot(r);
		const B = -p.dot(u);
		const C = -p.dot(f);

		// biome-ignore format: It's easier to distinguish matrix columns.
		this.viewMatrix.set(
            r.x, u.x, f.x, 0,
            r.y, u.y, f.y, 0,
            r.z, u.z, f.z, 0,
            A, B, C, 1
        );

		this.viewMatrixArray.set(this.viewMatrix.elements);

		GPUContext.device.queue.writeBuffer(this.viewMatrixBuffer.instance, 0, this.viewMatrixArray.buffer, 0);
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
		this._updateView();
		this._updateProjection();
	}

	protected abstract _updateProjection(): void;
}

export default Camera;
