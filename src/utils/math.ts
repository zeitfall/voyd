import { PI, TWO_PI } from '~/constants';

export function randomFromRange(min = 0, max = 1) {
	return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

export function lerp(from: number, to: number, factor: number) {
	const t = clamp(factor, 0, 1);

	return (1 - t) * from + t * to;
}

export function damp(from: number, to: number, lambda: number, deltaTime: number) {
	return lerp(from, to, 1 - Math.exp(-lambda * deltaTime));
}

export function inverseLerp(min: number, max: number, value: number) {
	return clamp((min - value) / (min - max), 0, 1);
}

export function remap(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
	const factor = inverseLerp(oldMin, oldMax, value);

	return lerp(newMin, newMax, factor);
}

export function modRange(value: number, min: number, max: number) {
	const d = max - min;

	return min + ((((value - min) % d) + d) % d);
}

export function modRadians(value: number, min = 0, max = TWO_PI) {
	return modRange(value, min, max);
}

export function modDegrees(value: number, min = 0, max = 360) {
	return modRange(value, min, max);
}

export function toRadians(value: number): number {
	return (value * PI) / 180;
}

export function toDegrees(value: number): number {
	return (value * 180) / PI;
}
