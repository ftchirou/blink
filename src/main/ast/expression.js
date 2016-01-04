import { AstNode } from './astnode'

export class Expression extends AstNode {

    constructor() {
        super();

        this.line = -1;
        this.column = -1;
        this.expressionType = undefined;
    }

    hasType() {
        return this.expressionType !== undefined;
    }

    isExpression() {
        return true;
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

    isNative() {
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

    isThis() {
        return false;
    }

    isNullLiteral() {
        return false;
    }
}