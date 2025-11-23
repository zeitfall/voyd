class Instance<T> {
	#instance: T;

	constructor(value: T) {
		this.#instance = value;
	}

	get instance() {
		return this.#instance;
	}
}

export default Instance;
