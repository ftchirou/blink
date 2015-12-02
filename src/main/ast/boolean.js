import { Expression } from './expression'

export class BooleanLiteral extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isBooleanLiteral() {
        return true;
    }
}