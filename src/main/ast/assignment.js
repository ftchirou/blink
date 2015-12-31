import { Expression } from './expression'

export class Assignment extends Expression {

    constructor(identifier, operator, value) {
        super();

        this.identifier = identifier;
        this.operator = operator;
        this.expression = value;
    }

    isAssignment() {
        return true;
    }
}