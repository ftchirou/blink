import { Expression } from './expression'

export class MethodCall extends Expression {

    constructor(object, method, parameters, expressionType) {
        super(expressionType);

        this.object = object;
        this.method = method;
        this.parameters = parameters !== undefined ? parameters : [];
    }

    isMethodCall() {
        return true;
    }
}