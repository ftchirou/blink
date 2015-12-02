import { Expression } from './expression'

export class String extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isString() {
        return true;
    }
}