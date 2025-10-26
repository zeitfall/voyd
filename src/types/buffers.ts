import type { Tuple } from './utils';

export type BufferSource = ArrayBuffer | ArrayBufferView;

export type VertexAttributeNames = Tuple<'position' | 'normal' | 'uv'>;
