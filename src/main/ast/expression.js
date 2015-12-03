export class Expression {

    constructor(expressionType) {
        this.expressionType = expressionType;
        this.line = -1;
        this.column = -1;
    }

    isInitialization() {
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

    isConstructorCall() {
        return false;
    }

    isIntegerLiteral() {
        return false;
    }

    isDecimalLiteral() {
        return false;
    }

    isBooleanLiteral() {
        return false;
    }

    isStringLiteral() {
        return false;
    }

    isReference() {
        return false;
    }

    isUnaryExpression() {
        return false;
    }
}