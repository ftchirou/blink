export class Token {
    constructor(type, value, lineNumber, columnNumber) {
        this.type = type;
        this.value = value;
        this.line = lineNumber;
        this.column = columnNumber;
    }

    toString() {
        return '<' + this.type + ', ' + this.value + ', ' + this.line + ':' + this.column + '>';
    }
}