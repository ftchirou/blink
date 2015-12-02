import { Expression } from './expression'

export class Let extends Expression {

    constructor(initializations, body, type) {
        super(type);

        this.initializations = initializations !== undefined ? initializations : [];
        this.body = body;
    }

    isLet() {
        return true;
    }
}