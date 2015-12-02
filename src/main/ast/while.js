import { Expression } from './expression'

export class While extends Expression {

    constructor(condition, body, type) {
        super(type);

        this.condition = condition;
        this.body = body;
    }

    isWhile() {
        return true;
    }
}