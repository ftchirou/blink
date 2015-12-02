export class Expression {

    constructor(expressionType) {
        this.expressionType = expressionType;
    }

    isDeclaration() {
        return false;
    }

    isAssignment() {
        return false;
    }

    isMethodCall() {
        return false;
    }

    isIfElse() {
        return false;
    }

    isFor() {
        return false;
    }

    isWhile() {
        return false;
    }

    isBlock() {
        return false;
    }

    isLet() {
        return false;
    }

    isBinaryExpression() {
        return false;
    }

    isNew() {
        return false;
    }

    isInteger() {
        return false;
    }

    isDecimal() {
        return false;
    }

    isBoolean() {
        return false;
    }

    isString() {
        return false;
    }

    isReference() {
        return false;
    }
}