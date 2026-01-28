import AnyInputAction from './AnyInputAction';

class ScalarInputAction extends AnyInputAction<number> {
    constructor(name: string, value: number) {
        super(name, value);
    }
}

export default ScalarInputAction;