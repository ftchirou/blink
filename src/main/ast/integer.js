import { Expression } from './expression'

export class IntegerLiteral extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isIntegerLiteral() {
        return true;
    }
}