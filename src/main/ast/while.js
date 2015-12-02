import { Expression } from './expression'

export class While extends Expression {

    constructor(condition, body, expressionType) {
        super(expressionType);

        this.condition = condition;
        this.body = body;
    }

    isWhile() {
        return true;
    }
}