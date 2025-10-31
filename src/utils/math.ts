import { TWO_PI } from '~/constants';

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

export function lerp(from: number, to: number, fraction: number) {
	const t = clamp(fraction, 0, 1);

	return (1 - t) * from + t * to;
}

export function modRange(value: number, min: number, max: number) {
  const d = max - min;

  return min + ((value - min) % d + d) % d;
}

export function modRadians(value: number, min = 0, max = TWO_PI) {
	return modRange(value, min, max);
}

export function modDegrees(value: number, min = 0, max = 360) {
	return modRange(value, min, max);
}

export function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}

export function toDegrees(value: number): number {
	return (value * 180) / Math.PI;
}
