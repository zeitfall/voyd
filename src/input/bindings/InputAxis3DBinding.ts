import InputAxisBinding from './InputAxisBinding';

import type { InputAxis3DBindingDescriptor } from '~/types';

const InputAxis3DBindingBrand = Symbol('InputAxis3DBinding');

class InputAxis3DBinding extends InputAxisBinding<InputAxis3DBindingDescriptor> {
    declare readonly [InputAxis3DBindingBrand]: never;
}

export default InputAxis3DBinding;
