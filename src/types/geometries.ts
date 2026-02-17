import type { LiteralUnion } from './utils';

export type GeometryAttributeNames = LiteralUnion<'position' | 'normal' | 'uv'>;

export interface GeometryVertexData {
	vertices: number[];
	normals: number[];
	uvs: number[];
}
