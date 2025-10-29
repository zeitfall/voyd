import { defineReadOnlyProperty } from '~/utils';

class Instance<T> {
	declare readonly instance: T;

	constructor(value: T) {
		defineReadOnlyProperty(this, 'instance', value);
	}
}

export default Instance;
