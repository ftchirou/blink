import { Expression } from './expression'

export class FunctionCall extends Expression {

    constructor(object, functionName, args = []) {
        super();

        this.object = object;
        this.functionName = functionName;
        this.args = args;
    }

    isFunctionCall() {
        return true;
    }
}