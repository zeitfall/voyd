import InputCompositeBinding from './InputCompositeBinding';

import type { InputAxis2DBindingDescriptor } from '~/types';

const InputAxis2DBindingBrand = Symbol('InputAxis2DBinding');

class InputAxis2DBinding extends InputCompositeBinding<InputAxis2DBindingDescriptor> {
    declare readonly [InputAxis2DBindingBrand]: never;
}

export default InputAxis2DBinding;
