import { Expression } from './expression'

export class IfElse extends Expression {

    constructor(thenExpr, elseExpr, type) {
        super(type);

        this.thenExpr = thenExpr;
        this.elseExpr = elseExpr;
    }

    isIfElse() {
        return true;
    }
}