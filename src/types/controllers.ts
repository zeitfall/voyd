import type { PointerControllerButton } from '~/enums';

export interface ControllerOptions {
    mode: 'immediate' | 'sync';
}

export type ControllerCallback<E extends Event> = (event: E) => void;

export type ControllerBindings<K extends string, E extends Event> = Record<K, ControllerCallback<E>>;

export type PointerControllerButtonKeys = keyof typeof PointerControllerButton;
