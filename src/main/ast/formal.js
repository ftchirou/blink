export class Formal {

    constructor(identifier, type, lazy = false, line = -1, column = -1) {
        this.identifier = identifier;
        this.type = type;
        this.lazy = lazy;
        this.line = line;
        this.column = column;
    }
}