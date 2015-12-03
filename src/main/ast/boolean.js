import { Expression } from './expression'

export class BooleanLiteral extends Expression {

    constructor(value) {
        super();

        this.value = value;
    }

    isBooleanLiteral() {
        return true;
    }
}