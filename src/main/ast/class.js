import { Definition } from './definition'

export class Class extends Definition {

    constructor(name, parameters = [], superClass = undefined, superClassArgs = [], properties = [], functions = []) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.superClass = superClass;
        this.superClassArgs = superClassArgs;
        this.properties = properties;
        this.functions = functions;
    }

    isClass() {
        return true;
    }

    hasProperty(propertyName) {
        return this.properties.some((property) => property.name === propertyName);
    }

    getProperty(propertyName) {
        return this.properties.find((property) => property.name === propertyName);
    }

    hasFunctionWithName(functionName) {
        return this.functions.some((func) => func.name === functionName);
    }
}