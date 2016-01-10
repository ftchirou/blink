import { Expression } from './expression'

export class LazyExpression extends Expression {

    constructor(expression, context) {
        super();

        this.expression = expression;
        this.context = context;
    }

    isLazy() {
        return true;
    }
}