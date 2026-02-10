import InputControl from './InputControl';

import type {
    InputAxisBindingDescriptor,
    InputAxisBindingDescriptorResolver,
} from '~/types';

class InputAxisBinding<D extends InputAxisBindingDescriptor> {
    #controls: Readonly<InputAxisBindingDescriptorResolver<D>>;

    constructor(descriptor: D) {
        this.#controls = this.#resolveControls(descriptor);
    }

    get controls() {
        return this.#controls;
    }

    #resolveControls(descriptor: D) {
        const controls = {} as InputAxisBindingDescriptorResolver<D>;

        for (const controlGroupKey in descriptor) {
            const controlGroup = descriptor[controlGroupKey];
            const controlMap = new Map();

            controlGroup.forEach((controlReference) => {
                const controlKey = controlReference.key;
                const controlDeviceType = controlReference.deviceType;

                const control = new InputControl(controlDeviceType, controlKey);

                controlMap.set(controlKey, control)
            });

            // @ts-expect-error Type 'Map<any, any>' is not assignable to type 'D[Extract<keyof D, string>] extends InputControlReference[] ? InputControlMap : never'.
            controls[controlGroupKey] = controlMap;
        }

        return Object.freeze(controls);
    }
}

export default InputAxisBinding;
