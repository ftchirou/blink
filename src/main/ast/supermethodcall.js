import { Expression } from './expression'

export class SuperMethodCall extends Expression {

    constructor(methodName, args = []) {
        super();

        this.methodName = methodName;
        this.args = args;
    }

    isSuper() {
        return true;
    }
}