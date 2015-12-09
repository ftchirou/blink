import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters = [], superClass, superClassArgs = [], variables = [], methods = []) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.superClass = superClass;
        this.superClassArgs = superClassArgs;
        this.variables = variables;
        this.methods = methods;
    }

    isClass() {
        return true;
    }

    hasMethodWithName(methodName) {
        return this.methods.some((method) => method.name === methodName);
    }
}