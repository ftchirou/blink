export class CharUtils {

    static isLetterOrDigit(char) {
        return CharUtils.isLetter(char) || CharUtils.isDigit(char);
    }

    static isLetter(char) {
        var code = char.charCodeAt(0);

        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    static isDigit(char) {
        var code = char.charCodeAt(0);

        return code >= 48 && code <= 57;
    }

    static isWhitespace(char) {
        return /[ \t\r\f\v\u00A0\u2028\u2029]/.test(char);
    }

    static isDelimiter(char) {
        return char === '{' || char === '[' || char === '('
            || char === '}' || char === ']' || char === ')'
            || char === ':' || char === ',';
    }

    static isNewline(char) {
        return char === '\n' || char === '\r\n';
    }

    static isDot(char) {
        return char === '.';
    }

    static isOperator(char) {
        return char === '+' || char === '-' || char === '*' || char === '/'
            || char === '=' || char === '>' || char === '<' || char === '!'
            || char === '&' || char === '|' || char === '%';
    }

    static isIdentifierPart(char) {
        return char === '_' || char === '$' || CharUtils.isLetterOrDigit(char);
    }

    static isBeginningOfIdentifier(char) {
        return CharUtils.isLetter(char) || char === '_';
    }

    static isBeginningOfNumber(char) {
        return CharUtils.isDigit(char) || char === '.';
    }

    static isBeginningOfString(char) {
        return char === '"';
    }

    static isExponentSymbol(char) {
        return char === 'e' || char === 'E';
    }

    static isBeginningOfLiteral(char) {
        return CharUtils.isLetter(char) || CharUtils.isBeginningOfIdentifier(char)
            || CharUtils.isBeginningOfNumber(char) || CharUtils.isBeginningOfString(char);
    }

    static isEscapeCharacter(char) {
        return char === '\\';
    }

    static isEndOfEscapeSequence(char) {
        return char === '\"' || char === '\\' || char === 'n'
            || char === 'r' || char === 't' || char === 'b'
            || char === 'f' || char === 'v' || char === '0';
    }

    static isStringDelimiter(char) {
        return char === '\"';
    }
}