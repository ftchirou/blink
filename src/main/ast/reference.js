import { Expression } from './expression'

export class Reference extends Expression {

    constructor(identifier, type) {
        super(type);

        this.identifier = identifier;
    }

    isReference() {
        return true;
    }
}