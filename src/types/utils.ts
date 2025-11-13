export type Tuple<D = never> = D | (string & {});

export interface Constructor<T> {
	new (...args: any[]): T;
}
