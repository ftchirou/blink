import { Expression } from './expression'

export class MethodCall extends Expression {

    constructor(object, methodName, args = []) {
        super();

        this.object = object;
        this.methodName = methodName;
        this.args = args;
    }

    isMethodCall() {
        return true;
    }
}