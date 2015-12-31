import { Expression } from './expression'

export class This extends Expression {

    constructor() {
        super();
    }

    isThis() {
        return true;
    }
}