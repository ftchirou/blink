import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters, superClass, superClassArgs, variables, methods) {
        super();

        this.name = name;
        this.parameters = parameters !== undefined ? parameters : [];
        this.superClass = superClass;
        this.superClassArgs = superClassArgs;
        this.properties = variables !== undefined ? variables : [];
        this.methods = methods !== undefined ? methods : [];
    }

    isClass() {
        return true;
    }
}