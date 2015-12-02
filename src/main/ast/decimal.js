import { Expression } from './expression'

export class Decimal extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isDecimal() {
        return true;
    }
}