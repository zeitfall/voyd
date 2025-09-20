export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
}

export function lerp(from: number, to: number, value: number) {
    const t = clamp(value, 0, 1);

    return (1 - t) * from + t * to;
}
