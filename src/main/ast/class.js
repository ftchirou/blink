import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters = [], superClass, superClassArgs = [], variables = [], methods = []) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.superClass = superClass;
        this.superClassArgs = superClassArgs;
        this.properties = variables;
        this.methods;
    }

    isClass() {
        return true;
    }
}