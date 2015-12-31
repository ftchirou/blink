import { Expression } from './expression'

export class NativeExpression extends Expression {

    constructor(func) {
        super();

        this.func = func;
    }

    isNative() {
        return true;
    }
}