import { Types } from '../types/types'
import { TypesUtils } from '../types/typesutils'

export class Obj {

    constructor(type = undefined, properties = new Map(), methods = [], address = undefined) {
        this.type = type;
        this.properties = properties;
        this.functions = methods;
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

        klass.parameters.forEach((param) => {
            object.properties.set(param.identifier, Obj.defaultValue(context, param.type));
        });

        klass.properties.forEach((variable) => {
            object.properties.set(variable.identifier, Obj.defaultValue(context, variable.type));
        });

        klass.functions.forEach((method) => {
            let superClassMethodIndex = object.findMethodIndex(method);

            if (superClassMethodIndex !== -1 && method.override) {
                object.functions.splice(superClassMethodIndex, 1);
            }

            object.functions.push(method);
        });

        object.type = className;

        return object;
    }

    getMethod(methodName, argsTypes) {
        let methods = this.functions.filter((method) => method.name === methodName);

        for (let i = 0, length = methods.length; i < length; ++i) {
            let method = methods[i];
            let parametersTypes = method.parameters.map((param) => param.type);

            if (TypesUtils.allEqual(argsTypes, parametersTypes)) {
                return method;
            }
        }

        return null;
    }

    getMostSpecificFunction(functionName, argsTypes, context) {
        let functions = this.functions.filter((func) => func.name === functionName);

        if (functions.length === 0) {
            return undefined;
        }

        functions = functions.filter((method) => TypesUtils.allConform(argsTypes, method.parameters.map((param) => param.type), context));

        if (functions.length === 0) {
            return undefined;
        }

        return functions.reduce((curr, prev) => TypesUtils.mostSpecificFunction(curr, prev, context));
    }

    static defaultValue(context, type) {
        if (TypesUtils.isInternal(type)) {
            return undefined;
        }

        let value = null;

        switch (type) {
            case Types.Int:
                value = Obj.create(context, Types.Int);
                value.set('value', 0);

                break;

            case Types.Double:
                value = Obj.create(context, Types.Double);
                value.set('value', 0.0);

                break;

            case Types.Bool:
                value = Obj.create(context, Types.Bool);
                value.set('value', false);

                break;

            case Types.String:
                value = Obj.create(context, Types.String);
                value.set('value', '""');

                break;

            default:
                value = Obj.create(context, Types.Null);

                break;
        }

        return value;
    }

    findMethodIndex(method) {
        for (let i = 0, l = this.functions.length; i < l; ++i) {
            if (this.functions[i].equals(method)) {
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