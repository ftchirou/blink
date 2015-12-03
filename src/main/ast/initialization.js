import { Expression } from './expression'

export class Initialization extends Expression {

    constructor(identifier, type, value) {
        super();

        this.identifier = identifier;
        this.type = type;
        this.value = value;
    }

    isInitialization() {
        return true;
    }
}