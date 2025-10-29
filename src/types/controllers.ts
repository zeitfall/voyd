export type ControllerCallback<E extends Event> = (event: E) => void;

export type ControllerBindings<E extends Event> = Record<string, ControllerCallback<E>>;
