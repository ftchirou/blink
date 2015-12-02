import { Expression } from './expression'

export class Assignment extends Expression {

    constructor(identifier, value, expressionType) {
        super(expressionType);

        this.identifier = identifier;
        this.expression = value;
    }

    isAssignment() {
        return true;
    }
}