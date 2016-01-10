import { Types } from './types'

export class TypesUtils {

    static leastUpperBound(typeA, typeB, env) {
        if (typeA === typeB) {
            return typeA;
        }

        if (typeA === Types.Null) {
            return typeB;
        }

        if (typeB === Types.Null) {
            return typeA;
        }

        let classA = env.getClass(typeA);
        let classB = env.getClass(typeB);

        if (classA.superClass === classB.superClass) {
            return classA.superClass;
        }

        if (this.inheritanceIndex(typeA, Types.Object, env) > this.inheritanceIndex(typeB, Types.Object, env)) {
            return this.leastUpperBound(classA.superClass, typeB, env);
        }

        return this.leastUpperBound(typeA, classB.superClass, env);
    }

    static inheritanceIndex(typeA, typeB, env) {
        let index = 0;

        while (typeA !== undefined && typeA !== typeB) {
            index++;

            typeA = env.getClass(typeA).superClass;
        }

        return index;
    }

    static findMethodToApply(klass, name, argsTypes, env) {
        let methods = this.findMethods(klass, name, argsTypes, env);

        if (methods.length === 0) {
            return undefined;
        }

        methods = methods.filter((method) => this.allConform(
            argsTypes, method.parameters.map((param) => param.type), env
        ));

        if (methods.length === 0) {
            return undefined;
        }

        return methods.reduce((curr, prev) => this.mostSpecificFunction(curr, prev, env));
    }

    static findMethods(klass, name, argsTypes, env) {
        let methods = [];

        let index = (method) => {
            for (let i = 0, l = methods.length; i < l; ++i) {
                if (methods[i].equals(method)) {
                    return i;
                }

                return -1;
            }
        };

        let collect = (cls) => {
            if (cls.superClass !== undefined) {
                collect(env.getClass(cls.superClass));
            }

            cls.functions
                .filter((method) => method.name === name && method.parameters.length === argsTypes.length)
                .forEach((method) => {
                    let i = index(method);

                    if (i !== -1 && method.override) {
                        methods.splice(i, 1);
                    }

                    methods.push(method);
                });
        };

        collect(klass);

        return methods;
    }

    static findOverridedFunction(superClassName, overridingMethod, env) {
        if (superClassName === undefined) {
            return undefined;
        }

        let klass = env.getClass(superClassName);

        do {
            let method = klass.functions.find((method) => method.equals(overridingMethod));

            if (method !== undefined) {
                return method;
            }

            if (klass.superClass === undefined) {
                break;
            }

            klass = env.getClass(superClass.superClass);

        } while (klass.superClass !== undefined);

        return undefined;
    }

    static mostSpecificFunction(funcA, funcB, env) {
        if (funcA === undefined || funcB === undefined) {
            return undefined;
        }

        let paramsTypesA = funcA.parameters.map((param) => param.type);
        let paramsTypesB = funcB.parameters.map((param) => param.type);

        if (this.allConform(paramsTypesA, paramsTypesB, env)) {
            return funcA;
        }

        if (this.allConform(paramsTypesB, paramsTypesA, env)) {
            return funcB;
        }

        return undefined;
    }

    static allConform(typesA, typesB, env) {
        let length = typesA.length;

        if (typesB.length !== length) {
            return false;
        }

        for (let i = 0, l = typesA.length; i < l; ++i) {
            if (!this.conform(typesA[i], typesB[i], env)) {
                return false;
            }
        }

        return true;
    }

    static allEqual(typesA, typesB) {
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

    static conform(typeA, typeB, env) {
        if (typeB === Types.Object) {
            return true;
        }

        if (typeA === typeB) {
            return true;
        }

        if (!this.isPrimitive(typeB) && typeA === Types.Null) {
            return true;
        }

        let classA = env.getClass(typeA);
        let classB = env.getClass(typeB);

        do {
            if (classA.superClass === classB.name) {
                return true;
            }

            if (classB.superClass === undefined) {
                return false;
            }

            classB = env.getClass(classB.superClass);

        } while (classB.name !== Types.Object);

        return false;
    }

    static hasFunctionWithName(klass, methodName, env) {
        while (klass !== undefined) {
            if (klass.hasFunctionWithName(methodName)) {
                return true;
            }

            klass = env.getClass(klass.superClass);
        }

        return false;
    }

    static isPrimitive(type) {
        return type === Types.Int || type === Types.Double
            || type === Types.Bool || type === Types.Unit;
    }

    static isInternal(type) {
        return type === 'int' || type === 'double' || type === 'bool' || type === 'string';
    }
}