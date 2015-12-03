import { Expression } from './expression'

export class Reference extends Expression {

    constructor(identifier) {
        super();

        this.identifier = identifier;
    }

    isReference() {
        return true;
    }
}