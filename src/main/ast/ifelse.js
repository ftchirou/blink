import { Expression } from './expression'

export class IfElse extends Expression {

    constructor(condition, thenBranch, elseBranch, expressionType) {
        super(expressionType);

        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    isIfElse() {
        return true;
    }
}