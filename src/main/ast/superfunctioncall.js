import { Expression } from './expression'

export class SuperFunctionCall extends Expression {

    constructor(functionName, args = []) {
        super();

        this.functionName = functionName;
        this.args = args;
    }

    isSuper() {
        return true;
    }
}