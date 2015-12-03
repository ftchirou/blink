import { Expression } from './expression'

export class DecimalLiteral extends Expression {

    constructor(value) {
        super();

        this.value = value;
    }

    isDecimalLiteral() {
        return true;
    }
}