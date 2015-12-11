import * as assert from 'assert'
import { TokenType } from '../../main/lexer/tokentype'
import { Lexer } from '../../main/lexer/lexer'

describe('Lexer', () => {

    describe('#nextToken', () => {

        it('should recognize a newline character as a single token', () => {
            var lexer = new Lexer('\n');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Newline);
            assert.equal(token.value, '\n');
        });

        it('should recognize the number 0', () => {
            var lexer = new Lexer('0');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Integer);
            assert.equal(token.value, '0');
        });

        it('should recognize a simple integer literal', () => {
            var lexer = new Lexer('42');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Integer);
            assert.equal(token.value, '42');
        });

        it('should recognize a simple decimal literal', () => {
            var lexer = new Lexer('3.14');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Decimal);
            assert.equal(token.value, '3.14');
        });

        it('should recognize a decimal starting with dot (.)', () => {
            var lexer = new Lexer('.25');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Decimal);
            assert.equal(token.value, '.25');
        });

        it('should recognize a decimal in scientific notation', () => {
            var lexer = new Lexer('2e65');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Decimal);
            assert.equal(token.value, '2e65');
        });

        it('should recognize a decimal in scientific notation with negative exponent part', () => {
            var lexer = new Lexer('42e-65');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Decimal);
            assert.equal(token.value, '42e-65');
        });

        it('should recognize a simple string literal', () => {
            var lexer = new Lexer('"Hello, World!"');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.String);
            assert.equal(token.value, '"Hello, World!"');
        });

        it('should recognize a string containing a newline character', () => {
            var lexer = new Lexer('"a string containing a \\n newline character."');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.String);
            assert.equal(token.value, '"a string containing a \\n newline character."');
        });

        it('should recognize a string containing an espaced backslash', () => {
            var lexer = new Lexer('"a string with a \\\\ backslash"');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.String);
            assert.equal(token.value, '"a string with a \\\\ backslash"');
        });

        it('should recognize a string containing escaped double quotes', () => {
            var lexer = new Lexer('"a string containing an \\" escaped double quote"');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.String);
            assert.equal(token.value, '"a string containing an \\" escaped double quote"');
        });

        it('should recognize a string containing escape sequences', () => {
            var lexer = new Lexer('"a string containing \\t\\b\\r\\f\\v\\0 escape sequences"');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.String);
            assert.equal(token.value, '"a string containing \\t\\b\\r\\f\\v\\0 escape sequences"');
        });

        it('should recognize the boolean true literal', () => {
            var lexer = new Lexer('true');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.True);
            assert.equal(token.value, 'true');
        });

        it('should recognize the boolean false literal', () => {
            var lexer = new Lexer('false');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.False);
            assert.equal(token.value, 'false');
        });

        it('should recognize an identifier of a single letter', () => {
            var lexer = new Lexer('i');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'i');
        });

        it('should recognize an identifier made of letters', () => {
            var lexer = new Lexer('anIdentifier');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'anIdentifier');
        });

        it('should recognize an identifier starting with underscore (_)', () => {
            var lexer = new Lexer('_identifier');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, '_identifier');
        });

        it('should recognize an identifier containing an underscore (_)', () => {
            var lexer = new Lexer('an_identifier');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'an_identifier');
        });

        it('should recognize an identifier containing a $ character', () => {
            var lexer = new Lexer('an$identifier');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'an$identifier');
        });

        it('should recognize an identifier containing a digit', () => {
            var lexer = new Lexer('identifier1');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'identifier1');
        });

        it('should recognize the abstract keyword', () => {
            var lexer = new Lexer('abstract');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Abstract);
            assert.equal(token.value, 'abstract');
        });

        it('should recognize the class keyword', () => {
            var lexer = new Lexer('class');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Class);
            assert.equal(token.value, 'class');
        });

        it('should recognize the func keyword', () => {
            var lexer = new Lexer('func');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Func);
            assert.equal(token.value, 'func');
        });

        it('should recognize the else keyword', () => {
            var lexer = new Lexer('else');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Else);
            assert.equal(token.value, 'else');
        });

        it('should recognize the extends keyword', () => {
            var lexer = new Lexer('extends');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Extends);
            assert.equal(token.value, 'extends');
        });

        it('should recognize the false keyword', () => {
            var lexer = new Lexer('false');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.False);
            assert.equal(token.value, 'false');
        });

        it('should recognize the final keyword', () => {
            var lexer = new Lexer('final');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Final);
            assert.equal(token.value, 'final');
        });

        it('should recognize the for keyword', () => {
            var lexer = new Lexer('for');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.For);
            assert.equal(token.value, 'for');
        });

        it('should recognize the in keyword', () => {
            var lexer = new Lexer('in');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.In);
            assert.equal(token.value, 'in');
        });

        it('should recognize the if keyword', () => {
            var lexer = new Lexer('if');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.If);
            assert.equal(token.value, 'if');
        });

        it('should recognize the let keyword', () => {
            var lexer = new Lexer('let');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Let);
            assert.equal(token.value, 'let');
        });

        it('should recognize the new keyword', () => {
            var lexer = new Lexer('new');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.New);
            assert.equal(token.value, 'new');
        });

        it('should recognize the null keyword', () => {
            var lexer = new Lexer('null');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Null);
            assert.equal(token.value, 'null');
        });

        it('should recognize the override keyword', () => {
            var lexer = new Lexer('override');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Override);
            assert.equal(token.value, 'override');
        });

        it('should recognize the private keyword', () => {
            var lexer = new Lexer('private');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Private);
            assert.equal(token.value, 'private');
        });

        it('should recognize the protected keyword', () => {
            var lexer = new Lexer('protected');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Protected);
            assert.equal(token.value, 'protected');
        });

        it('should recognize the return keyword', () => {
            var lexer = new Lexer('return');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Return);
            assert.equal(token.value, 'return');
        });

        it('should recognize the super keyword', () => {
            var lexer = new Lexer('super');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Super);
            assert.equal(token.value, 'super');
        });

        it('should recognize the to keyword', () => {
            var lexer = new Lexer('to');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.To);
            assert.equal(token.value, 'to');
        });

        it('should recognize the this keyword', () => {
            var lexer = new Lexer('this');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.This);
            assert.equal(token.value, 'this');
        });

        it('should recognize the true keyword', () => {
            var lexer = new Lexer('true');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.True);
            assert.equal(token.value, 'true');
        });

        it('should recognize the var keyword', () => {
            var lexer = new Lexer('var');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Var);
            assert.equal(token.value, 'var');
        });

        it('should recognize the while keyword', () => {
            var lexer = new Lexer('while');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.While);
            assert.equal(token.value, 'while');
        });

        it('should recognize an identifier starting with a reserved keyword', () => {
            var lexer = new Lexer('toString');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Identifier);
            assert.equal(token.value, 'toString');
        });

        it('should recognize the dispatch (.) operator', () => {
            var lexer = new Lexer('.');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Dot);
            assert.equal(token.value, '.');
        });

        it('should recognize the left arrow (<-) operator', () => {
            var lexer = new Lexer('<-');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.LeftArrow);
            assert.equal(token.value, '<-');
        });

        it('should recognize the div-equal (/=) operator', () => {
            var lexer = new Lexer('/=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.DivEqual);
            assert.equal(token.value, '/=');
        });

        it('should recognize the equal (=) operator', () => {
            var lexer = new Lexer('=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Equal);
            assert.equal(token.value, '=');
        });

        it('should recognize the minus-equal (-=) operator', () => {
            var lexer = new Lexer('-=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.MinusEqual);
            assert.equal(token.value, '-=');
        });

        it('should recognize the modulo-equal (%=) operator', () => {
            var lexer = new Lexer('%=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.ModuloEqual);
            assert.equal(token.value, '%=');
        });

        it('should recognize the plus-equal (+=) operator', () => {
            var lexer = new Lexer('+=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.PlusEqual);
            assert.equal(token.value, '+=');
        });

        it('should recognize the right arrow (->) operator', () => {
            var lexer = new Lexer('->');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.RightArrow);
            assert.equal(token.value, '->');
        });

        it('should recognize the times-equal operator', () => {
            var lexer = new Lexer('*=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.TimesEqual);
            assert.equal(token.value, '*=');
        });

        it('should recognize the div (/) operator', () => {
            var lexer = new Lexer('/');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Div);
            assert.equal(token.value, '/');
        });

        it('should recognize the modulo (%) operator', () => {
            var lexer = new Lexer('%');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Modulo);
            assert.equal(token.value, '%');
        });

        it('should recognize the minus (-) operator', () => {
            var lexer = new Lexer('-');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Minus);
            assert.equal(token.value, '-');
        });

        it('should recognize the plus (+) operator', () => {
            var lexer = new Lexer('+');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Plus);
            assert.equal(token.value, '+');
        });

        it('should recognize the times (*) operator', () => {
            var lexer = new Lexer('*');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Times);
            assert.equal(token.value, '*');
        });

        it('should recognize the double-equal (==) operator', () => {
            var lexer = new Lexer('==');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.DoubleEqual);
            assert.equal(token.value, '==');
        });

        it('should recognize the greater (>) operator', () => {
            var lexer = new Lexer('>');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Greater);
            assert.equal(token.value, '>');
        });

        it('should recognize the greater-or-equal (>=) operator', () => {
            var lexer = new Lexer('>=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.GreaterOrEqual);
            assert.equal(token.value, '>=');
        });

        it('should recognize the less (<) operator', () => {
            var lexer = new Lexer('<');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Less);
            assert.equal(token.value, '<');
        });

        it('should recognize the less-or-equal operator', () => {
            var lexer = new Lexer('<=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.LessOrEqual);
            assert.equal(token.value, '<=');
        });

        it('should recognize the not-equal (!=) operator', () => {
            var lexer = new Lexer('!=');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.NotEqual);
            assert.equal(token.value, '!=');
        });

        it('should recognize the and (&&) operator', () => {
            var lexer = new Lexer('&&');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.And);
            assert.equal(token.value, '&&');
        });

        it('should recognize the not (!) operator', () => {
            var lexer = new Lexer('!');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Not);
            assert.equal(token.value, '!');
        });

        it('should recognize the or (||) operator', () => {
            var lexer = new Lexer('||');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Or);
            assert.equal(token.value, '||');
        });

        it('should recognize a colon (:)', () => {
            var lexer = new Lexer(':');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Colon);
            assert.equal(token.value, ':');
        });

        it('should recognize a comma (,)', () => {
            var lexer = new Lexer(',');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Comma);
            assert.equal(token.value, ',');
        });

        it('should recognize a left brace ({)', () => {
            var lexer = new Lexer('{');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.LeftBrace);
            assert.equal(token.value, '{');
        });

        it('should recognize a right brace (})', () => {
            var lexer = new Lexer('}');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.RightBrace);
            assert.equal(token.value, '}');
        });

        it('should recognize a left bracket ([)', () => {
            var lexer = new Lexer('[');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.LeftBracket);
            assert.equal(token.value, '[');
        });

        it('should recognize a right bracket (])', () => {
            var lexer = new Lexer(']');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.RightBracket);
            assert.equal(token.value, ']');
        });

        it('should recognize a left parenthesis (()', () => {
            var lexer = new Lexer('(');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.LeftParen);
            assert.equal(token.value, '(');
        });

        it('should recognize a right parenthesis ())', () => {
            var lexer = new Lexer(')');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.RightParen);
            assert.equal(token.value, ')');
        });

        it('should recognize a colon (:)', () => {
            var lexer = new Lexer(':');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Colon);
            assert.equal(token.value, ':');
        });

        it('should recognize a comma (,)', () => {
            var lexer = new Lexer(',');

            var token = lexer.nextToken();

            assert.equal(token.type, TokenType.Comma);
            assert.equal(token.value, ',');
        });

    });

    describe('#tokenize', () => {

        it('should properly tokenize a full method definition', () => {
            var lexer = new Lexer('func add(a: Int, b: Int): Int = {\n' +
                '   a + b\n' +
                '}');

            var tokens = lexer.tokenize();

            assert.equal(21, tokens.length);

            assert.equal(tokens[0].type, TokenType.Func);

            assert.equal(tokens[1].type, TokenType.Identifier);
            assert.equal(tokens[1].value, 'add');

            assert.equal(tokens[2].type, TokenType.LeftParen);

            assert.equal(tokens[3].type, TokenType.Identifier);
            assert.equal(tokens[3].value, 'a');

            assert.equal(tokens[4].type, TokenType.Colon);

            assert.equal(tokens[5].type, TokenType.Identifier);
            assert.equal(tokens[5].value, 'Int');

            assert.equal(tokens[6].type, TokenType.Comma);

            assert.equal(tokens[7].type, TokenType.Identifier);
            assert.equal(tokens[7].value, 'b');

            assert.equal(tokens[8].type, TokenType.Colon);

            assert.equal(tokens[9].type, TokenType.Identifier);
            assert.equal(tokens[9].value, 'Int');

            assert.equal(tokens[10].type, TokenType.RightParen);

            assert.equal(tokens[11].type, TokenType.Colon);

            assert.equal(tokens[12].type, TokenType.Identifier);
            assert.equal(tokens[12].value, 'Int');

            assert.equal(tokens[13].type, TokenType.Equal);

            assert.equal(tokens[14].type, TokenType.LeftBrace);

            assert.equal(tokens[15].type, TokenType.Newline);

            assert.equal(tokens[16].type, TokenType.Identifier);
            assert.equal(tokens[16].value, 'a');

            assert.equal(tokens[17].type, TokenType.Plus);

            assert.equal(tokens[18].type, TokenType.Identifier);
            assert.equal(tokens[18].value, 'b');

            assert.equal(tokens[19].type, TokenType.Newline);

            assert.equal(tokens[20].type, TokenType.RightBrace);
        });

        it('should assign the correct line and column numbers', () => {
            var lexer = new Lexer('func equals(a: Int, b: Int): Boolean = {\n' +
                '   a == b\n' +
                '}');

            var tokens = lexer.tokenize();

            assert.equal(0, tokens[0].line);
            assert.equal(0, tokens[0].column);

            assert.equal(0, tokens[1].line);
            assert.equal(5, tokens[1].column);

            assert.equal(0, tokens[2].line);
            assert.equal(11, tokens[2].column);

            assert.equal(0, tokens[3].line);
            assert.equal(12, tokens[3].column);

            assert.equal(0, tokens[4].line);
            assert.equal(13, tokens[4].column);

            assert.equal(0, tokens[5].line);
            assert.equal(15, tokens[5].column);

            assert.equal(0, tokens[6].line);
            assert.equal(18, tokens[6].column);

            assert.equal(0, tokens[7].line);
            assert.equal(20, tokens[7].column);

            assert.equal(0, tokens[8].line);
            assert.equal(21, tokens[8].column);

            assert.equal(0, tokens[9].line);
            assert.equal(23, tokens[9].column);

            assert.equal(0, tokens[10].line);
            assert.equal(26, tokens[10].column);

            assert.equal(0, tokens[11].line);
            assert.equal(27, tokens[11].column);

            assert.equal(0, tokens[12].line);
            assert.equal(29, tokens[12].column);

            assert.equal(0, tokens[13].line);
            assert.equal(37, tokens[13].column);

            assert.equal(0, tokens[14].line);
            assert.equal(39, tokens[14].column);

            assert.equal(0, tokens[15].line);
            assert.equal(40, tokens[15].column);

            assert.equal(1, tokens[16].line);
            assert.equal(3, tokens[16].column);

            assert.equal(1, tokens[17].line);
            assert.equal(5, tokens[17].column);

            assert.equal(1, tokens[18].line);
            assert.equal(8, tokens[18].column);

            assert.equal(1, tokens[19].line);
            assert.equal(9, tokens[19].column);

            assert.equal(2, tokens[20].line);
            assert.equal(0, tokens[20].column);
        });

        it('should tokenize a simple expression', () => {
            var lexer = new Lexer('42 + 21');

            var tokens = lexer.tokenize();

            assert.equal(3, tokens.length);

            assert.equal(tokens[0].type, TokenType.Integer);
            assert.equal(tokens[0].value, '42');

            assert.equal(tokens[1].type, TokenType.Plus);
            assert.equal(tokens[1].value, '+');

            assert.equal(tokens[2].type, TokenType.Integer);
            assert.equal(tokens[2].value, '21');
        });
    });
});