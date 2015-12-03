export class AstNode {

    constructor() {
    }

    isDefinition() {
        return false;
    }

    isExpression() {
        return true;
    }
}