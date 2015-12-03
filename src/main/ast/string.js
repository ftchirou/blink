import { Expression } from './expression'

export class StringLiteral extends Expression {

    constructor(value) {
        super();

        this.value = value;
    }

    isStringLiteral() {
        return true;
    }
}