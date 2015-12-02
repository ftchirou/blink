import { Expression } from './expression'

export class Boolean extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isBoolean() {
        return true;
    }
}