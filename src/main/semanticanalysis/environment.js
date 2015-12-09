import { Class } from '../ast/class'
import { Method } from '../ast/method'
import { SymbolTable } from './symboltable'

export class Environment {

    constructor() {
        this.classes = new Map();
        this.symbolTable = new SymbolTable();
        this.methods = new Map();
        this.currentClass = null;
    }

    addClass(klass) {
        this.classes.set(klass.name, klass);
        this.methods.set(klass.name, []);
    }

    hasClass(className) {
        return this.classes.has(className);
    }

    getClass(className) {
        return this.classes.get(className);
    }

    addMethod(className, method) {
        this.methods.get(className).push(method);
    }

    hasMethod(className, method) {
        return this.methods.get(className).some((m) => m.equals(method));
    }

    getMethod(className, methodName) {
        return this.methods.get(className).find((method) => method.name === methodName);
    }

    getSymbolTable(className) {
        return this.symbolTables.get(className);
    }

    conform(classNameA, classNameB) {
        let classA = this.find(classNameA);
        let classB = this.find(classNameB);

        do {
            if (classA.superClass === classB.name) {
                return true;
            }

            if (classB.superClass === undefined) {
                return false;
            }

            classB = this.find(classB.superClass);

        } while (classB !== undefined);

        return false;
    }
}

export let BuiltInTypes = {
    Object: 'Object',
    Boolean: 'Boolean',
    Int: 'Int',
    Double: 'Double',
    String: 'String',
    Unit: ''
};