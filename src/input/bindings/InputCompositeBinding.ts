import InputBinding from './InputBinding';
import InputControl from './InputControl';

import type {
    InputCompositeBindingDescriptor,
    InputCompositeBindingControlGroups,
} from '~/types';

class InputCompositeBinding<D extends InputCompositeBindingDescriptor> extends InputBinding {
    #controls: Readonly<InputCompositeBindingControlGroups<D>>;

    constructor(descriptor: D) {
        super();

        this.#controls = this.#resolveControls(descriptor);
    }

    get controls() {
        return this.#controls;
    }

    #resolveControls(descriptor: D) {
        const controls = {} as InputCompositeBindingControlGroups<D>;

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

export default InputCompositeBinding;
