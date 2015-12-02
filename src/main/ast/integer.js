import { Expression } from './expression'

export class Integer extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isInteger() {
        return true;
    }
}