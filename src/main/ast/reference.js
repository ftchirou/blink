import { Expression } from './expression'

export class Reference extends Expression {

    constructor(identifier, expressionType) {
        super(expressionType);

        this.identifier = identifier;
    }

    isReference() {
        return true;
    }
}