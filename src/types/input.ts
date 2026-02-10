import type { Vector2, Vector3 } from '~/math';

import type {
    InputControl,
    InputBinding,
    InputAxis1DBinding,
    InputAxis2DBinding,
    InputAxis3DBinding,
    InputActionAxisState,
    InputActionVector2State,
    InputActionVector3State,
} from '~/input';

import type { InputDeviceType, InputControlType, MouseButton } from '~/enums';

export interface InputDevice {
    readonly type: InputDeviceType;

    connect(): void;
    disconnect(): void;
    getEvent(key: unknown): UIEvent | undefined;
    hasEvent(key: unknown): boolean;
}

export type PointerButton = MouseButton | `Touch${number}`;

export type InputManagerDeviceMap = ReadonlyMap<InputDeviceType, InputDevice>;

export type InputActionValueDictionary = {
    [InputControlType.DISCRETE]: number;
    [InputControlType.CONTINUOUS]: number;
    [InputControlType.AXIS]: number;
    [InputControlType.VECTOR_2]: Vector2;
    [InputControlType.VECTOR_3]: Vector3;
};

export type InputBindingDictionary = {
    [InputControlType.DISCRETE]: InputBinding;
    [InputControlType.CONTINUOUS]: InputBinding;
    [InputControlType.AXIS]: InputBinding | InputAxis1DBinding;
    [InputControlType.VECTOR_2]: InputBinding | InputAxis2DBinding;
    [InputControlType.VECTOR_3]: InputBinding | InputAxis3DBinding;
};

export type InputActionStateDictionary = {
    [InputControlType.DISCRETE]: unknown;
    [InputControlType.CONTINUOUS]: unknown;
    [InputControlType.AXIS]: InputActionAxisState;
    [InputControlType.VECTOR_2]: InputActionVector2State;
    [InputControlType.VECTOR_3]: InputActionVector3State;
};

export interface InputActionState<C extends InputControlType> {
    readonly value: Readonly<InputActionValueDictionary[C]>;

    update(devices: InputManagerDeviceMap, bindings: Set<InputBindingDictionary[C]>): void;
}

export interface InputControlReference {
    deviceType: InputDeviceType;
    key: string;
}

export type InputControlMap = ReadonlyMap<string, InputControl>;

export type InputAxis1DDirection = 'positive' | 'negative';
export type InputAxis2DDirection = 'left' | 'right' | 'up' | 'down';
export type InputAxis3DDirection = InputAxis2DDirection | 'forward' | 'backward';

export type InputAxisBindingDescriptor<D extends string = any> = {
    [K in D]: InputControlReference[];
};

export type InputAxis1DBindingDescriptor = InputAxisBindingDescriptor<InputAxis1DDirection>;
export type InputAxis2DBindingDescriptor = InputAxisBindingDescriptor<InputAxis2DDirection>;
export type InputAxis3DBindingDescriptor = InputAxisBindingDescriptor<InputAxis3DDirection>;

export type InputAxisBindingDescriptorResolver<D extends InputAxisBindingDescriptor = InputAxisBindingDescriptor> = {
    [K in keyof D]: D[K] extends InputControlReference[] ? InputControlMap : never;
};
