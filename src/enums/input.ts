export enum InputDeviceType {
    KEYBOARD,
    POINTER,
    GAMEPAD,
    GYROSCOPE
}

export enum InputControlType {
    DISCRETE,
    CONTINUOUS,
    AXIS,
    VECTOR_2,
    VECTOR_3
}

// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#determining_button_states
export enum MouseButton {
    NONE = -1,
    LMB,
    MMB,
    RMB,
    BACK,
    FORWARD
}
