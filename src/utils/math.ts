export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
}

export function lerp(from: number, to: number, ratio: number) {
    const t = clamp(ratio, 0, 1);

    return (1 - t) * from + t * to;
}
