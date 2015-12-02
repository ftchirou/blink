import { Expression } from './expression'

export class Declaration extends Expression {

    constructor(identifier, type, initialization, expressionType) {
        super(expressionType);

        this.identifier = identifier;
        this.type = type;
        this.initialization = initialization;
    }

    isDeclaration() {
        return true;
    }
}