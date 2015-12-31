import { Environment } from './environment'
import { Store } from './store'
import { Types } from '../types/types'

export class Context {

    constructor(classes = new Map(), environment = new Environment(), store = new Store(), self) {
        this.classes = classes;
        this.environment = environment;
        this.store = store;
        this.self = self;
    }

    addClass(klass) {
        this.classes.set(klass.name, klass);
    }

    getClass(className) {
        return this.classes.get(className);
    }

    removeClass(className) {
        this.classes.delete(className);
    }

    mostSpecificMethod(methodA, methodB) {
        if (methodA === undefined || methodB === undefined) {
            return undefined;
        }

        let paramsTypesA = methodA.parameters.map((param) => param.type);
        let paramsTypesB = methodB.parameters.map((param) => param.type);

        if (this.allConform(paramsTypesA, paramsTypesB)) {
            return methodA;

        } else if (this.allConform(paramsTypesB, paramsTypesA)) {
            return methodB;
        }

        return undefined;
    }

    allConform(context, typesA, typesB) {
        for (let i = 0, length = typesA.length; i < length; ++i) {
            if (!this.conform(context, typesA[i], typesB[i])) {
                return false;
            }
        }

        return true;
    }

    conform(context, typeA, typeB) {
        if (typeB === Types.Object || typeA === typeB) {
            return true;
        }

        let classA = context.getClass(typeA);
        let classB = context.getClass(typeB);

        do {
            if (classB === Types.Object) {
                return false;
            }

            if (classA.superClass === classB.name) {
                return true;
            }

            if (classB.superClass === undefined) {
                return false;
            }

            classB = context.getClass(classB.superClass);

        } while (classB !== undefined);

        return false;
    }
}