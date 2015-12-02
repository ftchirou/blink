import { Expression } from './expression'

export class For extends Expression {

    constructor(identifier, generator, body, type) {
        super(type);

        this.identifier = identifier;
        this.generator = generator;
        this.body = body;
    }

    isFor() {
        return true;
    }
}