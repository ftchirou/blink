import { Expression } from './expression'

export class Integer extends Expression {

    constructor(value, type) {
        super(type);

        this.value = value;
    }

    isInteger() {
        return true;
    }
}