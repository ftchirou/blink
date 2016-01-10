import { AstNode } from './astnode'

export class Definition extends AstNode {

    constructor() {
        super();

        this.line = -1;
        this.column = -1;
    }

    isDefinition() {
        return true;
    }

    isClass() {
        return false;
    }

    isProperty() {
        return false;
    }

    isFunction() {
        return false;
    }
}