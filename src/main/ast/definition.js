import { AstNode } from './astnode'

export class Definition extends AstNode {

    constructor() {
        super();
    }

    isDefinition() {
        return true;
    }

    isClass() {
        return false;
    }

    isVariable() {
        return false;
    }

    isMethod() {
        return false;
    }
}