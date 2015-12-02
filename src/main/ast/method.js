import { Definition } from './definition'

export class Method extends Definition {

    constructor(name, parameters = [], returnType, body, override) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.body = body;
        this.override = override;
    }

    isMethod() {
        return true;
    }
}