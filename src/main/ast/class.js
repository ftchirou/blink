import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters, superClass, superClassArgs, body) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.superClass = superClass;
        this.superClassArgs = superClassArgs;
        this.body = body;
    }

    isClass() {
        return true;
    }
}