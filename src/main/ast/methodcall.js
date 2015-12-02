import { Expression } from './expression'

export class MethodCall extends Expression {

    constructor(object, methodName, args, expressionType) {
        super(expressionType);

        this.object = object;
        this.methodName = methodName;
        this.args = args !== undefined ? args : [];
    }

    isMethodCall() {
        return true;
    }
}