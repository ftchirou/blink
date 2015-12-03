import { Expression } from './expression'

export class UnaryExpression extends Expression {

    constructor(operator, expression) {
        super();

        this.operator = operator;
        this.expression = expression;
    }

    isUnaryExpression() {
        return true;
    }
}