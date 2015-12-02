import { Expression } from './expression'

export class String extends Expression {

    constructor(value, type) {
        super(type);

        this.value = value;
    }

    isString() {
        return true;
    }
}