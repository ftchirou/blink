import { Expression } from './expression'

export class Let extends Expression {

    constructor(initializations, body) {
        super();

        this.initializations = initializations !== undefined ? initializations : [];
        this.body = body;
    }

    isLet() {
        return true;
    }
}