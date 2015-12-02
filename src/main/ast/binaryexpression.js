import { Expression } from './expression'

export class BinaryExpression extends Expression {

    constructor(left, operator, right, expressionType) {
        super(expressionType);

        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    isBinaryExpression() {
        return true;
    }
}