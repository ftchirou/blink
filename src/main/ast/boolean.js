import { Expression } from './expression'

export class Boolean extends Expression {

    constructor(value, type) {
        super(type);

        this.value = value;
    }

    isBoolean() {
        return true;
    }
}