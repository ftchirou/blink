import { CharUtils } from '../util/charutils'
import { InvalidFsmState, Fsm } from './fsm/fsm'
import { Report } from '../util/report'
import { Token } from './token'
import { TokenType } from './tokentype'

export class Lexer {

    constructor(input) {
        this.input = input;
        this.inputSize = input.length;
        this.buffer = [];
        this.position = 0;
        this.line = 0;
        this.column = 0;
    }

    tokenize() {
        let tokens = [];

        let token = null;

        do {
            token = this.nextToken();

            if (token.type === TokenType.EndOfInput) {
                break;
            }

            tokens.push(token);

        } while (token.type !== TokenType.EndOfInput);

        return tokens;
    }

    nextToken() {
        if (this.buffer.length > 0) {
            return this.buffer.pop();
        }

        return this.readToken();
    }

    lookahead() {
        var token = this.readToken();

        this.buffer.push(token);

        return token;
    }

    readToken() {
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

        if (CharUtils.isDot(symbol)) {
            let column = this.column;

            this.position++;
            this.column++;

            return new Token(TokenType.Dot, '.', this.line, column);
        }

        if (CharUtils.isNewline(symbol)) {
            let line = this.line;
            let column = this.column;

            this.position++;
            this.line++;
            this.column = 0;

            return new Token(TokenType.Newline, '\n', line, column);
        }

        throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));
    }

    recognizeLiteral() {
        let symbol = this.input.charAt(this.position);

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

        throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));
    }

    recognizeKeywordOrIdentifier() {
        let token = this.recognizeKeyword();

        return token !== null ? token : this.recognizeIdentifier();
    }

    recognizeKeyword() {
        let symbol = this.input.charAt(this.position);

        let keywords = Object.keys(TokenType).filter(key => TokenType[key].charAt(0) === symbol);

        for (let i in keywords) {
            let keyword = keywords[i];

            let token = this.recognizeToken(TokenType[keyword]);

            if (token !== null) {
                let offset = token.value.length;

                if (CharUtils.isIdentifierPart(this.input.charAt(this.position + offset))) {
                    return null;
                }

                this.position += offset;
                this.column += offset;

                return token;
            }
        }

        return null;
    }

    recognizeIdentifier() {
        let identifier = '';

        while (this.position < this.inputSize) {
            let symbol = this.input.charAt(this.position);

            if (!CharUtils.isIdentifierPart(symbol)) {
                break;
            }

            identifier += symbol;

            this.position++;
        }

        let column = this.column;

        this.column += identifier.length;

        return new Token(TokenType.Identifier, identifier, this.line, column);
    }

    recognizeNumber() {
        let recognizer = this.buildNumberRecognizer();

        let { recognized, value } = recognizer.run(this.input.substring(this.position));

        if (!recognized) {
            throw new Error(Report.error(this.line, this.column, 'Unrecognized number literal.'));
        }

        if (this.input.charAt(this.position) === '.' && value === '.') {
            this.position++;
            this.column++;

            return new Token(TokenType.Dot, '.', this.line, this.column - 1);
        }

        let offset = value.length;

        if (value.charAt(offset - 1) === '.') {
            value = value.substring(0, offset - 1);
            offset--;
        }

        let column = this.column;

        this.position += offset;
        this.column += offset;

        return new Token(value.includes('.') || value.includes('e') || value.includes('E') ? TokenType.Decimal : TokenType.Integer, value, this.line, column);
    }

    recognizeString() {
        let recognizer = this.buildStringRecognizer();

        let { recognized, value } = recognizer.run(this.input.substring(this.position));

        if (!recognized) {
            throw new Error(Report.error(this.line, this.column, 'Invalid string literal.'));
        }

        let offset = value.length;
        let column = this.column;

        this.position += offset;
        this.column += offset;

        return new Token(TokenType.String, value, this.line, column);
    }

    recognizeToken(token) {
        let length = token.length;

        for (let i = 0; i < length; ++i) {
            if (this.input.charAt(this.position + i) !== token.charAt(i)) {
                return null;
            }
        }

        return new Token(token, token, this.line, this.column);
    }

    recognizeDelimiter() {
        let symbol = this.input.charAt(this.position);

        let column = this.column;

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
                throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));
        }
    }

    recognizeOperator() {
        let symbol = this.input.charAt(this.position);
        let lookahead = this.position + 1 < this.inputSize ? this.input.charAt(this.position + 1) : null;
        let column = this.column;

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

            case '~':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.TildeEqual, '~=', this.line, column)
                    : new Token(TokenType.Tilde, '~', this.line, column);

            case '$':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.DollarEqual, '$=', this.line, column)
                    : new Token(TokenType.Dollar, '$', this.line, column);

            case '^':
                return lookahead !== null && lookahead === '='
                    ? new Token(TokenType.CaretEqual, '^=', this.line, column)
                    : new Token(TokenType.Caret, '^', this.line, column);

            case '&':
                if (lookahead !== null && lookahead === '&') {
                    return new Token(TokenType.And, '&&', this.line, column);
                }

                throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));

            case '|':
                if (lookahead !== null && lookahead === '|') {
                    return new Token(TokenType.Or, '||', this.line, column);
                }

                throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));

            case '/':
                if (lookahead !== '=' && lookahead !== '/') {
                    return new Token(TokenType.Div, '/', this.line, column);
                }

                if (lookahead === '=') {
                    return new Token(TokenType.DivEqual, '/=', this.line, column);
                }

                if (lookahead === '/') {
                    this.skipUntilNewline();

                    return this.nextToken();
                }

                break;

            case '<':
                if (lookahead !== '=' && lookahead !== '-') {
                    return new Token(TokenType.Less, '<', this.line, column);
                }

                if (lookahead === '=') {
                    return new Token(TokenType.LessOrEqual, '<=', this.line, column);
                }

                if (lookahead === '-') {
                    return new Token(TokenType.LeftArrow, '<-', this.line, column);
                }

                break;


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

                throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));

            default:
                throw new Error(Report.error(this.line, this.column, `Unrecognized token '${symbol}'.`));
        }
    }

    buildStringRecognizer() {
        let recognizer = new Fsm();

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
        let recognizer = new Fsm();

        recognizer.states = new Set(['Start', 'Zero', 'Integer', 'StartDecimal', 'Decimal', 'StartExponentNotation', 'NumberInExponentNotation', 'End']);

        recognizer.startState = 'Start';

        recognizer.finalStates = new Set(['Zero', 'Integer', 'StartDecimal', 'Decimal', 'NumberInExponentNotation', 'End']);

        recognizer.transition = (state, symbol) => {
            switch (state) {
                case 'Start':
                    if (symbol === '0') {
                        return 'Zero';
                    }

                    if (symbol === '.') {
                        return 'StartDecimal';
                    }

                    if (CharUtils.isDigit(symbol)) {
                        return 'Integer';
                    }

                    break;

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

    skipUntilNewline() {
        while (this.position < this.inputSize && !CharUtils.isNewline(this.input.charAt(this.position))) {
            this.position++;
            this.column++;
        }
    }
}
