import { Definition } from './definition'

export class Variable extends Definition {

    constructor(name, type, value) {
        super();

        this.name = name;
        this.type = type;
        this.value = value;
    }

    isVariable() {
        return true;
    }
}