import { Expression } from './expression'

export class MethodCall extends Expression {

    constructor(object, method, parameters, type) {
        super(type);

        this.object = object;
        this.method = method;
        this.parameters = parameters !== undefined ? parameters : [];
    }

    isMethodCall() {
        return true;
    }
}