import { TokenType } from './tokentype'
import { Token } from './token'
import { CharUtils } from '../util/charutils'
import { InvalidFsmState, Fsm } from './fsm/fsm'

export class Lexer {

    constructor(input) {
        this.input = input;
        this.inputSize = input.length;
        this.position = 0;
        this.line = 0;
        this.column = 0;
    }

    tokenize() {
        var tokens = [];

        do {
            var token = this.nextToken();

            if (token.type === TokenType.EndOfInput) {
                break;
            }

            tokens.push(token);

        } while (token.type !== TokenType.EndOfInput);

        return tokens;
    }

    nextToken() {
        this.skipWhitespaces();

        if (this.position >= this.inputSize) {
            return new Token(TokenType.EndOfInput);
        }

        var symbol = this.input.charAt(this.position);

        if (CharUtils.isBeginningOfLiteral(symbol)) {
            return this.recognizeLiteral();
        }

        if (CharUtils.isOperator(symbol)) {
            return this.recognizeOperator();
        }

        if (CharUtils.isDelimiter(symbol)) {
            return this.recognizeDelimiter();
        }

        if (CharUtils.isNewline(symbol)) {
            var line = this.line;
            var column = this.column;

            this.position++;
            this.line++;
            this.column = 0;

            return new Token(TokenType.Newline, '\n', line, column);
        }

        throw new Error('Unrecognized token at ' + this.line + ':' + this.column);
    }

    recognizeLiteral() {
        var symbol = this.input.charAt(this.position);

        if (CharUtils.isLetter(symbol)) {
            return this.recognizeKeywordOrIdentifier();
        }

        if (CharUtils.isBeginningOfIdentifier(symbol)) {
            return this.recognizeIdentifier();
        }

        if (CharUtils.isBeginningOfNumber(symbol)) {
            return this.recognizeNumber();
        }

        if (CharUtils.isBeginningOfString(symbol)) {
            return this.recognizeString();
        }

        throw new Error('Unrecognized token at ' + this.line + ':' + this.column);
    }

    recognizeKeywordOrIdentifier() {
        var token = this.recognizeKeyword();

        return token !== null ? token : this.recognizeIdentifier();
    }

    recognizeKeyword() {
        var symbol = this.input.charAt(this.position);

        var keywords = Object.keys(TokenType).filter(key => TokenType[key].charAt(0) === symbol);

        for (var i in keywords) {
            var keyword = keywords[i];

            var token = this.recognizeToken(TokenType[keyword]);

            if (token !== null) {
                var offset = token.value.length;

                this.position += offset;
                this.column += offset;

                return token;
            }
        }

        return null;
    }

    recognizeIdentifier() {
        var identifier = '';

        while (this.position < this.inputSize) {
            var symbol = this.input.charAt(this.position);

            if (!CharUtils.isIdentifierPart(symbol)) {
                break;
            }

            identifier += symbol;

            this.position++;
        }

        var columnNumber = this.column;

        this.column += identifier.length;

        return new Token(TokenType.Identifier, identifier, this.line, columnNumber);
    }

    recognizeNumber() {
        var recognizer = this.buildNumberRecognizer();

        var { recognized, value } = recognizer.run(this.input.substring(this.position));

        if (!recognized) {
            throw new Error('Unrecognized number literal at ' + this.line + ':' + this.column);
        }

        var offset = value.length;
        var column = this.column;

        this.position += offset;
        this.column += offset;

        return new Token(value.includes('.') || value.includes('e') || value.includes('E') ? TokenType.Decimal : TokenType.Integer, value, this.line, column);
    }

    recognizeString() {
        var recognizer = this.buildStringRecognizer();

        var { recognized, value } = recognizer.run(this.input.substring(this.position));

        if (!recognized) {
            throw new Error('Invalid string literal at ' + this.line + ':' + this.column);
        }

        var offset = value.length - 1;
        var column = this.column;

        this.position += offset;
        this.column += offset;

        return new Token(TokenType.String, value, this.line, column);
    }

    recognizeToken(token) {
        var length = token.length;

        for (var i = 0; i < length; ++i) {
            if (this.input.charAt(this.position + i) !== token.charAt(i)) {
                return null;
            }
        }

        return new Token(token, token, this.line, this.column);
    }

    recognizeDelimiter() {
        var symbol = this.input.charAt(this.position);

        var column = this.column;

        this.position++;
        this.column++;

        switch (symbol) {
            case '{':
                return new Token(TokenType.LeftBrace, '{', this.line, column);

            case '}':
                return new Token(TokenType.RightBrace, '}', this.line, column);

            case '[':
                return new Token(TokenType.LeftBracket, '[', this.line, column);

            case ']':
                return new Token(TokenType.RightBracket, ']', this.line, column);

            case '(':
                return new Token(TokenType.LeftParen, '(', this.line, column);

            case ')':
                return new Token(TokenType.RightParen, ')', this.line, column);

            case ',':
                return new Token(TokenType.Comma, ',', this.line, column);

            case ':':
                return new Token(TokenType.Colon, ':', this.line, column);

            default:
                throw new Error('Unrecognized token at ' + this.line + ':' + this.column);
        }
    }

    recognizeOperator() {
        var symbol = this.input.charAt(this.position);
        var lookahead = this.position + 1 < this.inputSize ? this.input.charAt(this.position + 1) : null;
        var column = this.column;

        if (lookahead !== null && (lookahead === '=' || lookahead === '&' || lookahead === '|' || lookahead === '-')) {
            this.position++;
            this.column++;
        }

        this.position++;
        this.column++;

        switch (symbol) {
            case '=':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.DoubleEqual, '==', this.line, column)
                    : new Token(TokenType.Equal, '=', this.line, column);

            case '/':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.DivEqual, '/=', this.line, column)
                    : new Token(TokenType.Div, '/', this.line, column);

            case '%':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.ModuloEqual, '%=', this.line, column)
                    : new Token(TokenType.Modulo, '%', this.line, column);

            case '+':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.PlusEqual, '+=', this.line, column)
                    : new Token(TokenType.Plus, '+', this.line, column);

            case '*':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.TimesEqual, '*=', this.line, column)
                    : new Token(TokenType.Times, '*', this.line, column);

            case '>':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.GreaterOrEqual, '>=', this.line, column)
                    : new Token(TokenType.Greater, '>', this.line, column);

            case '!':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.NotEqual, '!=', this.line, column)
                    : new Token(TokenType.Not, '!', this.line, column);

            case '&':
                if (lookahead !== null && lookahead === '&') {
                    return new Token(TokenType.And, '&&', this.line, column);
                }

                throw new Error('Unrecognized token at ' + this.line + ':' + column);

            case '|':
                if (lookahead !== null && lookahead === '|') {
                    return new Token(TokenType.Or, '||', this.line, column);
                }

                throw new Error('Unrecognized token at ' + this.line + ':' + column);

            case '<':
                if (lookahead === null) {
                    return new Token(TokenType.Less, '<', this.line, column);
                }

                if (lookahead === '=') {
                    return new Token(TokenType.LessOrEqual, '<=', this.line, column);
                }

                if (lookahead === '-') {
                    return new Token(TokenType.LeftArrow, '<-', this.line, column);
                }

                throw new Error('Unrecognized token at ' + this.line + ':' + column);


            case '-':
                if (lookahead === null || (lookahead !== '=' && lookahead !== '>')) {
                    return new Token(TokenType.Minus, '-', this.line, column);
                }

                if (lookahead === '=') {
                    return new Token(TokenType.MinusEqual, '-=', this.line, column);
                }

                if (lookahead === '>') {
                    return new Token(TokenType.RightArrow, '->', this.line, column);
                }

                throw new Error('Unrecognized token at ' + this.line + ':' + column);

            default:
                throw new Error('Unrecognized token at ' + this.line + ':' + column);

        }
    }

    buildStringRecognizer() {
        var recognizer = new Fsm();

        recognizer.states = new Set(['Start', 'StartString', 'Character', 'Backslash', 'EscapeSequence', 'EndString']);

        recognizer.startState = 'Start';
        recognizer.finalStates = new Set(['EndString']);
        recognizer.transition = (state, symbol) => {
            switch (state) {
                case 'Start':
                    if (CharUtils.isStringDelimiter(symbol)) {
                        return 'StartString';
                    }
                    break;

                case 'StartString':
                case 'Character':
                    if (CharUtils.isStringDelimiter(symbol)) {
                        return 'EndString';
                    }

                    if (CharUtils.isEscapeCharacter(symbol)) {
                        return 'Backslash';
                    }

                    return 'Character';

                case 'Backslash':
                    if (CharUtils.isEndOfEscapeSequence(symbol)) {
                        return 'EscapeSequence';
                    }
                    break;

                case 'EscapeSequence':
                    if (CharUtils.isStringDelimiter(symbol)) {
                        return 'EndString';
                    }

                    if (CharUtils.isEscapeCharacter(symbol)) {
                        return 'Backslash';
                    }

                    return 'Character';

                default:
                    break;
            }

            return InvalidFsmState;
        };

        return recognizer;
    }

    buildNumberRecognizer() {
        var recognizer = new Fsm();

        recognizer.states = new Set(['Start', 'Zero', 'Integer', 'StartDecimal', 'Decimal', 'StartExponentNotation', 'NumberInExponentNotation', 'End']);

        var symbol = this.input.charAt(this.position);
        if (symbol === '0') {
            recognizer.startState = 'Zero';
        } else if (symbol === '.') {
            recognizer.startState = 'StartDecimal';
        } else if (CharUtils.isDigit(symbol)) {
            recognizer.startState = 'Integer';
        }

        recognizer.finalStates = new Set(['Zero', 'Integer', 'Decimal', 'NumberInExponentNotation', 'End']);

        recognizer.transition = (state, symbol) => {
            switch (state) {
                case 'Zero':
                    if (CharUtils.isExponentSymbol(symbol)) {
                        return 'StartExponentNotation';
                    }

                    if (symbol == '.') {
                        return 'StartDecimal';
                    }

                    break;

                case 'Integer':
                    if (CharUtils.isDigit(symbol)) {
                        return 'Integer';
                    }

                    if (CharUtils.isExponentSymbol(symbol)) {
                        return 'StartExponentNotation';
                    }

                    if (symbol == '.') {
                        return 'StartDecimal';
                    }

                    break;

                case 'StartDecimal':
                    if (CharUtils.isDigit(symbol)) {
                        return 'Decimal';
                    }

                    return InvalidFsmState;

                case 'StartExponentNotation':
                    if (CharUtils.isDigit(symbol) || symbol === '-') {
                        return 'NumberInExponentNotation';
                    }

                    break;

                case 'Decimal':
                    if (CharUtils.isDigit(symbol)) {
                        return 'Decimal';
                    }

                    if (CharUtils.isExponentSymbol(symbol)) {
                        return 'StartExponentNotation';
                    }

                    break;

                case 'NumberInExponentNotation':
                    if (CharUtils.isDigit(symbol)) {
                        return 'NumberInExponentNotation';
                    }

                    break;

                default:
                    break;
            }

            return InvalidFsmState;
        };

        return recognizer;
    }

    skipWhitespaces() {
        while (this.position < this.inputSize && CharUtils.isWhitespace(this.input.charAt(this.position))) {
            this.position++;
            this.column++;
        }
    }
}