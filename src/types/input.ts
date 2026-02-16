import type { Vector, Vector2, Vector3 } from '~/math';

import type {
    InputControl,
    InputSingleBinding,
    InputAxis1DBinding,
    InputAxis2DBinding,
    InputAxis3DBinding,
    InputActionDiscreteState,
    InputActionContinuousState,
    InputActionAxisState,
    InputActionVector2State,
    InputActionVector3State,
    InputActionDiscreteEvaluator,
    InputActionContinuousEvaluator,
    InputActionAxisEvaluator,
    InputActionVector2Evaluator,
    InputActionVector3Evaluator,
    InputNumberClampProcessor,
    InputNumberNormalizeProcessor,
    InputNumberScaleProcessor,
    InputNumberInvertProcessor,
    InputVectorNormalizeProcessor,
    InputVectorScaleProcessor,
    InputVector2InvertProcessor,
    InputVector3InvertProcessor
} from '~/input';

import type { InputDeviceType, InputControlType, MouseButton } from '~/enums';

export interface InputDevice<T extends InputDeviceType = InputDeviceType> {
    readonly type: T;

    connect(): void;
    disconnect(): void;
    getEvent(key: unknown): InputDeviceEventMap[T];
    hasEvent(key: unknown): boolean;
}

export type InputDeviceMap = ReadonlyMap<InputDeviceType, InputDevice>;

export interface InputDeviceEventMap {
    [InputDeviceType.KEYBOARD]: KeyboardEvent;
    [InputDeviceType.POINTER]: PointerEvent;
    [InputDeviceType.GAMEPAD]: GamepadEvent;
    [InputDeviceType.GYROSCOPE]: unknown;
}

export interface InputDeviceEventAdapter<
    D extends InputDeviceType = InputDeviceType,
    E extends InputDeviceEventMap[D] = InputDeviceEventMap[D]
> {
    getDiscrete(event: E): number;
    getContinuous(event: E): number;
    getDelta<V extends Vector>(event: E, outValue: V): V;
    getPosition<V extends Vector>(event: E, outValue: V): V;
}

export type PointerButton = MouseButton | `Touch${number}`;

export interface InputActionValueMap {
    [InputControlType.DISCRETE]: number;
    [InputControlType.CONTINUOUS]: number;
    [InputControlType.AXIS]: number;
    [InputControlType.VECTOR_2]: Vector2;
    [InputControlType.VECTOR_3]: Vector3;
}

export interface InputActionStateMap {
    [InputControlType.DISCRETE]: InputActionDiscreteState;
    [InputControlType.CONTINUOUS]: InputActionContinuousState;
    [InputControlType.AXIS]: InputActionAxisState;
    [InputControlType.VECTOR_2]: InputActionVector2State;
    [InputControlType.VECTOR_3]: InputActionVector3State;
}

export interface InputActionEvaluator<
    C extends InputControlType,
    V extends InputActionValueMap[C] = InputActionValueMap[C]
> {
    evaluate(devices: InputDeviceMap, binding: InputBindingMap[C], tempValue: V): V;
    resolve(oldValue: V, newValue: V): V;
    reset(value: V): V;
}

export interface InputActionEvaluatorMap {
    [InputControlType.DISCRETE]: InputActionDiscreteEvaluator;
    [InputControlType.CONTINUOUS]: InputActionContinuousEvaluator;
    [InputControlType.AXIS]: InputActionAxisEvaluator;
    [InputControlType.VECTOR_2]: InputActionVector2Evaluator;
    [InputControlType.VECTOR_3]: InputActionVector3Evaluator;
}

export interface InputProcessor<V = unknown> {
    process(value: V): V;
}

export type InputNumberProcessor =
    | InputNumberClampProcessor
    | InputNumberNormalizeProcessor
    | InputNumberScaleProcessor
    | InputNumberInvertProcessor;

export type InputVectorProcessor =
    | InputVectorNormalizeProcessor
    | InputVectorScaleProcessor;

export interface InputProcessorMap {
    [InputControlType.DISCRETE]: InputNumberProcessor;
    [InputControlType.CONTINUOUS]: InputNumberProcessor;
    [InputControlType.AXIS]: InputNumberProcessor;
    [InputControlType.VECTOR_2]: InputVectorProcessor | InputVector2InvertProcessor;
    [InputControlType.VECTOR_3]: InputVectorProcessor | InputVector3InvertProcessor;
}

export type InputAxis1DDirection = 'positive' | 'negative';
export type InputAxis2DDirection = 'left' | 'right' | 'up' | 'down';
export type InputAxis3DDirection = InputAxis2DDirection | 'forward' | 'backward';

export interface InputBindingMap {
    [InputControlType.DISCRETE]: InputSingleBinding;
    [InputControlType.CONTINUOUS]: InputSingleBinding;
    [InputControlType.AXIS]: InputSingleBinding | InputAxis1DBinding;
    [InputControlType.VECTOR_2]: InputSingleBinding | InputAxis2DBinding;
    [InputControlType.VECTOR_3]: InputSingleBinding | InputAxis3DBinding;
}

export type InputCompositeBindingDescriptor<D extends string = any> = {
    [K in D]: InputControlReference[];
};

export type InputAxis1DBindingDescriptor = InputCompositeBindingDescriptor<InputAxis1DDirection>;
export type InputAxis2DBindingDescriptor = InputCompositeBindingDescriptor<InputAxis2DDirection>;
export type InputAxis3DBindingDescriptor = InputCompositeBindingDescriptor<InputAxis3DDirection>;

export type InputCompositeBindingControlGroups<D extends InputCompositeBindingDescriptor = InputCompositeBindingDescriptor> = {
    [K in keyof D]: D[K] extends InputControlReference[] ? InputControlMap : never;
};

export interface InputControlReference {
    deviceType: InputDeviceType;
    key: unknown;
}

export type InputControlMap = ReadonlyMap<string, InputControl>;
