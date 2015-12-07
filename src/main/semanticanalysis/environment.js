import { Class } from '../ast/class'
import { Method } from '../ast/method'
import { SymbolTable } from './symboltable'

export class Environment {

    constructor() {
        this.symbolTable = new SymbolTable();
        this.classes = new Set();
    }

    addClass(klass) {
        this.classes.set(klass.name, klass);
    }

    checkMethod(klass, methodName) {
        return klass.methods.some((method) => method.name === methodName);
    }

    findMethod(klass, methodName) {
        return klass.methods.find((method) => method.name === methodName);
    }
}