import { Expression } from './expression'

export class New extends Expression {

    constructor(type, arguments, expressionType) {
        super(expressionType);

        this.type = type;
        this.arguments = arguments;
    }

    isNew() {
        return true;
    }
}