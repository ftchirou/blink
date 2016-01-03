import { Expression } from './expression'

export class Assignment extends Expression {

    constructor(identifier, operator, value) {
        super();

        this.identifier = identifier;
        this.operator = operator;
        this.value = value;
    }

    isAssignment() {
        return true;
    }
}