import { Expression } from './expression'

export class Assignment extends Expression {

    constructor(identifier, value, type) {
        super(type);

        this.identifier = identifier;
        this.expression = value;
    }

    isAssignment() {
        return true;
    }
}