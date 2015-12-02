import { Expression } from './expression'

export class Block extends Expression {

    constructor(expressions, expressionType) {
        super(expressionType);

        this.expressions = expressions !== undefined ? expressions : [];
    }

    isBlock() {
        return true;
    }
}