import { Expression } from './expression'

export class Cast extends Expression {

    constructor(object, type) {
        super();

        this.object = object;
        this.type = type;
    }

    isCast() {
        return true;
    }
}