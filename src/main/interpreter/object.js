import { TypesUtils } from '../types/typesutils'

export class Obj {

    constructor(type = undefined, properties = new Map(), methods = [], address = undefined) {
        this.type = type;
        this.properties = properties;
        this.methods = methods;
        this.address = address;
    }

    get(propertyName) {
        return this.properties.get(propertyName);
    }

    set(propertyName, value) {
        this.properties.set(propertyName, value);
    }

    has(propertyName) {
        return this.properties.has(propertyName);
    }

    static create(context, className) {
        let klass = context.getClass(className);

        let object = klass.superClass !== undefined
            ? Obj.create(context, klass.superClass)
            : new Obj(className);

        klass.variables.forEach((variable) => {
            object.properties.set(variable.identifier, undefined);
        });

        klass.methods.forEach((method) => {
            let superClassMethodIndex = object.findMethodIndex(method);

            if (superClassMethodIndex !== -1 && method.override) {
                object.methods.splice(superClassMethodIndex, 1);
            }

            object.methods.push(method);
        });

        object.type = className;

        return object;
    }

    getMethod(methodName, argsTypes) {
        let methods = this.methods.filter((method) => method.name === methodName);

        for (let i = 0, length = methods.length; i < length; ++i) {
            let method = methods[i];
            let parametersTypes = method.parameters.map((param) => param.type);

            if (TypesUtils.allEqual(argsTypes, parametersTypes)) {
                return method;
            }
        }

        return null;
    }

    getMostSpecificMethod(methodName, argsTypes, context) {
        let methods = this.methods.filter((method) => method.name === methodName);

        return methods.filter((method) => TypesUtils.allConform(argsTypes, method.parameters.map((param) => param.type), context))
                      .reduce((curr, prev) => TypesUtils.mostSpecificMethod(curr, prev, context));

    }

    allEqual(typesA, typesB) {
        let length = typesA.length;

        if (typesB.length !== length) {
            return false;
        }

        for (let i = 0; i < length; ++i) {
            if (typesA[i] !== typesB[i]) {
                return false;
            }
        }

        return true;
    }

    findMethodIndex(method) {
        for (let i = 0, l = this.methods.length; i < l; ++i) {
            if (this.methods[i].equals(method)) {
                return i;
            }
        }

        return -1;
    }

    toString() {
        let str = this.type + '(';

        let l = this.properties.keys.length;

        for (let i = 0; i < l - 1; ++i) {
            str += this.properties.keys[i] + ': ' + this.properties.get(this.properties.keys[i]) + ', ';
        }

        str += this.properties.keys[l - 1] + ': ' + this.properties.get(this.properties.keys[l - 1]);

        str += ')';

        return str;
    }
}