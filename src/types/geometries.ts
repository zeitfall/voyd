import type { Tuple } from './utils';

export type GeometryAttributeNames = Tuple<'position' | 'normal' | 'uv'>;

export interface GeometryVertexData {
	vertices: number[];
	normals: number[];
	uvs: number[];
}
