import { VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

import type { Geometry } from '~/geometries';

class VertexBufferLayout implements GPUVertexBufferLayout {
	static fromGeometry(geometry: Geometry, stepMode?: GPUVertexStepMode) {
		const layout = new VertexBufferLayout();

		if (stepMode) {
			layout.setStepMode(stepMode);
		}

		geometry.attributes.forEach((attribute) => {
			layout.addAttribute(attribute.format);
		});

		return layout;
	}

	declare arrayStride: number;
	declare stepMode: GPUVertexStepMode;
	declare attributes: GPUVertexAttribute[];

	constructor() {
		this.arrayStride = 0;
		this.stepMode = 'vertex';
		this.attributes = [];
	}

	setArrayStride(stride: number) {
		this.arrayStride = stride;

		return this;
	}

	setStepMode(mode: GPUVertexStepMode) {
		this.stepMode = mode;

		return this;
	}

	addAttribute(format: GPUVertexFormat) {
		const offset = this.arrayStride;
		const shaderLocation = this.attributes.length;

		this.attributes.push({
			format,
			offset,
			shaderLocation,
		});

		this.arrayStride += VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP[format];

		return this;
	}
}

export default VertexBufferLayout;
