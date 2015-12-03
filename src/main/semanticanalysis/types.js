import { Class } from '../ast/class'

export class Types {

    constructor() {
        this.types = new Map();;
    }

    add(name, type) {
        this.types.set(name, type);
    }

    find(typeName) {
        return this.types.get(typeName);
    }

    conform(typeA, typeB) {
        let classA = this.find(typeA);
        let classB = this.find(typeB);

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

export let BuiltIns = {
    Boolean: 'Boolean',
    Int: 'Int',
    Double: 'Double',
    String: 'String'
};