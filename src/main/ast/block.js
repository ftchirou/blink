import { Expression } from './expression'

export class Block extends Expression {

    constructor(expressions = []) {
        super();

        this.expressions = expressions;
    }

    isBlock() {
        return true;
    }
}