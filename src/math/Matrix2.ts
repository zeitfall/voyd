import Matrix from './Matrix';
import Vector from './Vector';

import type { ArrayOf } from '~/types';

const ELEMENT_COUNT = 4;
const COLUMN_COUNT = 2;

class Matrix2 extends Matrix {
	constructor(elements: ArrayOf<number, typeof ELEMENT_COUNT>);
	constructor(columns: ArrayOf<Vector, typeof COLUMN_COUNT>);
	constructor(...element: ArrayOf<number, typeof ELEMENT_COUNT>);
	constructor(...column: ArrayOf<Vector, typeof COLUMN_COUNT>);
	constructor(...args: unknown[]) {
		super(args, ELEMENT_COUNT, COLUMN_COUNT);
	}
}

export default Matrix2;
