import { Expression } from './expression'

export class DecimalLiteral extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isDecimalLiteral() {
        return true;
    }
}