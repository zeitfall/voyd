import InputCompositeBinding from './InputCompositeBinding';

import type { InputAxis1DBindingDescriptor } from '~/types';

const InputAxis1DBindingBrand = Symbol('InputAxis1DBinding');

class InputAxis1DBinding extends InputCompositeBinding<InputAxis1DBindingDescriptor> {
    declare readonly [InputAxis1DBindingBrand]: never;
}

export default InputAxis1DBinding;
