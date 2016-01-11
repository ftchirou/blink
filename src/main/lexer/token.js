export class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    toString() {
        return '<' + this.type + ', ' + this.value + ', ' + this.line + ':' + this.column + '>';
    }
}