export type ArrayOf<T, L, A extends T[] = []> = A['length'] extends L ? A : ArrayOf<T, L, [...A, T]>;
