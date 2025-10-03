export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
}

export function lerp(from: number, to: number, fraction: number) {
    const t = clamp(fraction, 0, 1);

    return (1 - t) * from + t * to;
}
