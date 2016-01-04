import { Environment } from './environment'
import { Store } from './store'
import { Types } from '../types/types'
import { TypesUtils } from '../types/typesutils'

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
}