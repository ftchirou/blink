import { Expression } from './expression'

export class Block extends Expression {

    constructor(expressions = [], expressionType) {
        super(expressionType);

        this.expressions = expressions;
    }

    isBlock() {
        return true;
    }
}