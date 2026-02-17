export type LiteralUnion<D = never> = D | (string & {});

export type ValueOf<T> = T[keyof T];

export interface Constructor<T> {
	new (...args: any[]): T;
}
