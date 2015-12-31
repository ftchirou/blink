import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters = [], superClass = undefined, superClassArgs = [], variables = [], methods = []) {
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

    hasVariable(variableName) {
        return this.variables.some((variable) => variable.name === variableName);
    }

    getVariable(variableName) {
        return this.variables.find((variable) => variable.name === variableName);
    }

    hasMethodWithName(methodName) {
        return this.methods.some((method) => method.name === methodName);
    }
}