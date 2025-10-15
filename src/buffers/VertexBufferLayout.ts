import { VERTEX_ATTRIBUTE_FORMAT_BYTE_SIZE_MAP } from '~/constants';

class VertexBufferLayout implements GPUVertexBufferLayout {
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
