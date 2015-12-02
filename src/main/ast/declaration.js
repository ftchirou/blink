import { Expression } from './expression'

export class Declaration extends Expression {

    constructor(identifier, declaredType, initialization, type) {
        super(type);

        this.identifier = identifier;
        this.declaredType = declaredType;
        this.initialization = initialization;
    }

    isDeclaration() {
        return true;
    }
}