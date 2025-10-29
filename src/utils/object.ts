export function defineWritableProperty<O, K extends keyof O>(object: O, key: K, value: unknown) {
	Object.defineProperty(object, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true,
	});
}

export function defineReadOnlyProperty<O, K extends keyof O>(object: O, key: K, value: unknown) {
	Object.defineProperty(object, key, {
		value,
		enumerable: true,
	});
}

export function defineWritableProperties<O, K extends keyof O>(object: O, values: Record<K, unknown>) {
	const properties = Object.entries(values).reduce((object, entry) => {
		const [key, value] = entry;

		object[key] = {
			value,
			writable: true,
			enumerable: true,
			configurable: true,
		};

		return object;
	}, {} as PropertyDescriptorMap);

	Object.defineProperties(object, properties);
}

export function defineReadOnlyProperties<O, K extends keyof O>(object: O, values: Record<K, unknown>) {
	const properties = Object.entries(values).reduce((object, entry) => {
		const [key, value] = entry;

		object[key] = { value, enumerable: true };

		return object;
	}, {} as PropertyDescriptorMap);

	Object.defineProperties(object, properties);
}
