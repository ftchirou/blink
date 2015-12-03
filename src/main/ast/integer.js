import { Expression } from './expression'

export class IntegerLiteral extends Expression {

    constructor(value) {
        super();

        this.value = value;
    }

    isIntegerLiteral() {
        return true;
    }
}