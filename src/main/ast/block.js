import { Expression } from './expression'

export class Block extends Expression {

    constructor(expressions, type) {
        super(type);

        this.expressions = expressions !== undefined ? expressions : [];
    }

    isBlock() {
        return true;
    }
}