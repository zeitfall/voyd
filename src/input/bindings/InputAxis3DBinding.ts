import InputCompositeBinding from './InputCompositeBinding';

import type { InputAxis3DBindingDescriptor } from '~/types';

const InputAxis3DBindingBrand = Symbol('InputAxis3DBinding');

class InputAxis3DBinding extends InputCompositeBinding<InputAxis3DBindingDescriptor> {
    declare readonly [InputAxis3DBindingBrand]: never;
}

export default InputAxis3DBinding;
