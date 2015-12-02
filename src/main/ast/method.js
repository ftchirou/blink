import { Definition } from './definition'

export class Method extends Definition {

    constructor(name, parameters = [], returnType, body, overriding) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.body = body;
        this.overriding = overriding;
    }

    isMethod() {
        return true;
    }
}