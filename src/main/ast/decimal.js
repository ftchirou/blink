import { Expression } from './expression'

export class Decimal extends Expression {

    constructor(value, type) {
        super(type);

        this.value = value;
    }

    isDecimal() {
        return true;
    }
}