import { Expression } from './expression'

export class NullLiteral extends Expression {

    constructor() {
        super();
    }

    isNullLiteral() {
        return true;
    }
}