import { Expression } from './expression'

export class StringLiteral extends Expression {

    constructor(value, expressionType) {
        super(expressionType);

        this.value = value;
    }

    isStringLiteral() {
        return true;
    }
}