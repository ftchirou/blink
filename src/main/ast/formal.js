export class Formal {

    constructor(identifier, type, line = -1, column = -1) {
        this.identifier = identifier;
        this.type = type;
        this.line = line;
        this.column = column;
    }
}