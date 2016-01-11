import { Assignment } from '../ast/assignment'
import { BinaryExpression } from '../ast/binaryexpression'
import { Block } from '../ast/block'
import { BooleanLiteral } from '../ast/boolean'
import { Cast } from '../ast/cast'
import { Class } from '../ast/class'
import { ConstructorCall } from '../ast/constructorcall'
import { DecimalLiteral } from '../ast/decimal'
import { Initialization } from '../ast/initialization'
import { Formal } from '../ast/formal'
import { IfElse } from '../ast/ifelse'
import { IntegerLiteral } from '../ast/integer'
import { Let } from '../ast/let'
import { Lexer } from '../lexer/lexer'
import { Function } from '../ast/func'
import { FunctionCall } from '../ast/functioncall'
import { NullLiteral } from '../ast/null'
import { Program } from '../ast/program'
import { Reference } from '../ast/reference'
import { Report } from '../util/report'
import { StringLiteral } from '../ast/string'
import { SuperFunctionCall } from '../ast/superfunctioncall'
import { This } from '../ast/this'
import { TokenType } from '../lexer/tokentype'
import { Token } from '../lexer/token'
import { Types } from '../types/types'
import { UnaryExpression } from '../ast/unaryexpression'
import { Property } from '../ast/property'
import { While } from '../ast/while'

export class Parser {

    constructor(input) {
        this.lexer = new Lexer(input);
        this.currentToken = this.lexer.nextToken();
    }

    parseAssignment() {
        let assignment = new Assignment();

        assignment.identifier = this.expect(TokenType.Identifier).value;

        assignment.operator = this.currentToken.value;

        this.currentToken = this.lexer.nextToken();

        assignment.value = this.parseExpression();

        return assignment;
    }

    parseBinaryExpression(acceptOperatorFunction, parseBranchFunction) {
        let expression = parseBranchFunction.apply(this);

        if (acceptOperatorFunction.apply(this)) {

            while (acceptOperatorFunction.apply(this)) {
                let binaryExpression = new BinaryExpression();

                binaryExpression.operator = this.currentToken.value

                this.currentToken = this.lexer.nextToken();

                binaryExpression.left = expression;

                binaryExpression.right = parseBranchFunction.apply(this);

                expression = binaryExpression;
            }
        }

        return expression;
    }

    parseBlock() {
        this.expect(TokenType.LeftBrace);

        var block = new Block();

        while (!this.accept(TokenType.RightBrace)) {
            block.expressions.push(this.parseExpression());
        }

        this.expect(TokenType.RightBrace);

        return block;
    }

    parseBooleanExpression() {
        return this.parseBinaryExpression(this.acceptBooleanOperator, this.parseComparison);
    }

    parseCast() {
        let expression = this.parseBooleanExpression();

        if (this.acceptCastOperator()) {
            while (this.acceptCastOperator()) {
                this.expect(TokenType.As);

                let cast = new Cast();

                cast.object = expression;

                cast.type = this.expect(TokenType.Identifier).value;

                expression = cast;
            }
        }

        return expression;
    }

    parseClass() {
        let classToken = this.expect(TokenType.Class);

        let klass = new Class(this.expect(TokenType.Identifier).value);

        if (this.accept(TokenType.LeftParen)) {
            klass.parameters = this.parseFormals();
        }

        if (!this.accept(TokenType.Extends)) {
            klass.superClass = Types.Object;
        } else {
            this.expect(TokenType.Extends);

            klass.superClass = this.expect(TokenType.Identifier).value;

            if (this.accept(TokenType.LeftParen)) {
                klass.superClassArgs = this.parseActuals();
            }
        }

        this.parseClassBody(klass);

        klass.line = classToken.line;
        klass.column = classToken.column;

        return klass;
    }

    parseConstructorCall() {
        this.expect(TokenType.New);

        let call = new ConstructorCall();

        call.type = this.expect(TokenType.Identifier).value;

        call.args = this.parseActuals();

        return call;
    }

    parseDefinition() {
        let token = this.currentToken;

        let definition = null;

        if (this.accept(TokenType.Class)) {
            definition = this.parseClass();
        }

        if (this.accept(TokenType.Override) || this.accept(TokenType.Func)) {
            definition = this.parseFunction();
        }

        if (definition === null) {
            throw new Error(Report.error(token.type, token.column, `Unexpected '${token.type}'.`));
        }

        return definition;
    }

    parseFormals() {
        this.expect(TokenType.LeftParen);

        let formals = [];

        if (!this.accept(TokenType.RightParen)) {
            do {
                if (this.accept(TokenType.Comma)) {
                    this.expect(TokenType.Comma);
                }

                let lazy = false;

                if (this.accept(TokenType.Lazy)) {
                    this.expect(TokenType.Lazy);
                    lazy = true;
                }

                let nameToken = this.expect(TokenType.Identifier);

                this.expect(TokenType.Colon);

                let type = this.expect(TokenType.Identifier).value;

                formals.push(new Formal(nameToken.value, type, lazy, nameToken.line, nameToken.column));

            } while (this.accept(TokenType.Comma));
        }

        this.expect(TokenType.RightParen);

        return formals;
    }

    parseFunction() {
        let overrideToken = null;
        let privateToken = null;

        let override = false;
        let isPrivate = false;

        if (this.accept(TokenType.Override)) {
            overrideToken = this.expect(TokenType.Override);

            override = true;
        } else if (this.accept(TokenType.Private)) {
            privateToken = this.expect(TokenType.Private);

            isPrivate = true;
        }

        let funcToken = this.expect(TokenType.Func);

        let func = new Function();

        func.override = override;
        func.isPrivate = isPrivate;
        func.line = isPrivate ? privateToken.line : override ? overrideToken.line : funcToken.line;
        func.column = isPrivate ? privateToken.column : override ? overrideToken.column : funcToken.column;

        if (this.accept(TokenType.Identifier)) {
            func.name = this.expect(TokenType.Identifier).value;

        } else if (this.acceptOperator()) {
            func.name = this.currentToken.value;

            this.currentToken = this.lexer.nextToken();

        } else {
            throw new Error(Report.error(func.line, func.column, `Expected identifier or operator as method name, but found '${this.currentToken.value}'.`));
        }

        func.parameters = this.parseFormals();

        if (!this.accept(TokenType.Colon)) {
            func.returnType = Types.Unit;
        } else {
            this.expect(TokenType.Colon);

            func.returnType = this.expect(TokenType.Identifier).value;
        }

        this.expect(TokenType.Equal);

        func.body = this.parseExpression();

        return func;
    }

    parseFunctionCall() {
        let call = new FunctionCall();
        let token = null;

        if (this.accept(TokenType.Identifier)) {
            token = this.expect(TokenType.Identifier);

        } else {
            token = this.currentToken;
            this.currentToken = this.lexer.nextToken();
        }

        call.functionName = token.value;
        call.line = token.line;
        call.column = token.column;
        call.args = this.parseActuals();

        return call;
    }

    parseIfElse() {
        this.expect(TokenType.If);

        var ifElse = new IfElse();

        this.expect(TokenType.LeftParen);

        ifElse.condition = this.parseExpression();

        this.expect(TokenType.RightParen);

        ifElse.thenBranch = this.parseExpression();

        if (this.accept(TokenType.Else)) {
            this.expect(TokenType.Else);

            ifElse.elseBranch = this.parseExpression();
        }

        return ifElse;
    }

    parseInitializations() {
        let initializations = [];

        do {

            if (this.accept(TokenType.Comma)) {
                this.expect(TokenType.Comma);
            }

            let initialization = new Initialization();

            let token = this.expect(TokenType.Identifier);

            initialization.identifier = token.value;

            if (this.accept(TokenType.Colon)) {
                this.expect(TokenType.Colon);

                initialization.type = this.expect(TokenType.Identifier).value;
            }

            if (this.accept(TokenType.Equal)) {
                this.expect(TokenType.Equal);

                initialization.value = this.parseExpression();
            }

            initialization.line = token.line;
            initialization.column = token.column;

            initializations.push(initialization);

        } while (this.accept(TokenType.Comma));

        return initializations;
    }

    parseLet() {
        this.expect(TokenType.Let);

        var letExpr = new Let();

        letExpr.initializations = this.parseInitializations();

        this.expect(TokenType.In);

        letExpr.body = this.parseExpression();

        return letExpr;
    }

    parseNull() {
        this.expect(TokenType.Null);

        return new NullLiteral();
    }

    parseProgram() {
        let program = new Program();

        while (!this.accept(TokenType.EndOfInput)) {
            program.classes.push(this.parseClass());
        }

        return program;
    }

    parseProperty() {
        let varToken = this.expect(TokenType.Var);

        let property = new Property();

        property.name = this.expect(TokenType.Identifier).value;

        if (this.accept(TokenType.Colon)) {
            this.expect(TokenType.Colon);

            property.type = this.expect(TokenType.Identifier).value;
        }

        if (this.accept(TokenType.Equal)) {
            this.expect(TokenType.Equal);

            property.value = this.parseExpression();
        }

        property.line = varToken.line;
        property.column = varToken.column;

        return property;
    }

    parseSuperFunctionCall() {
        this.expect(TokenType.Super);

        this.expect(TokenType.Dot);

        let call = this.parseFunctionCall();

        return new SuperFunctionCall(call.functionName, call.args);
    }

    parseThis() {
        this.expect(TokenType.This);

        return new This();
    }

    parseWhile() {
        this.expect(TokenType.While);

        var whileExpr = new While();

        this.expect(TokenType.LeftParen);

        whileExpr.condition = this.parseExpression();

        this.expect(TokenType.RightParen);

        whileExpr.body = this.parseExpression();

        return whileExpr;
    }

    parseExpression() {
        return this.parseCast();
    }

    parseComparison() {
        return this.parseBinaryExpression(this.acceptComparisonOperator, this.parseAddition);
    }

    parseAddition() {
        return this.parseBinaryExpression(this.acceptAdditiveOperator, this.parseMultiplication);
    }

    parseMultiplication() {
        return this.parseBinaryExpression(this.acceptMultiplicativeOperator, this.parseDispatch);
    }

    parseActuals() {
        this.expect(TokenType.LeftParen);

        let actuals = [];

        if (!this.accept(TokenType.RightParen)) {
            do {
                if (this.accept(TokenType.Comma)) {
                    this.expect(TokenType.Comma);
                }

                actuals.push(this.parseExpression());

            } while (this.accept(TokenType.Comma));
        }

        this.expect(TokenType.RightParen);

        return actuals;
    }

    parseClassBody(klass) {
        this.expect(TokenType.LeftBrace);

        do {
            if (this.accept(TokenType.RightBrace)) {
                break;
            }

            if (this.accept(TokenType.Var)) {
                klass.properties.push(this.parseProperty());

            } else if (this.accept(TokenType.Func) || this.accept(TokenType.Private) || this.accept(TokenType.Override)) {
                klass.functions.push(this.parseFunction());

            } else if (this.accept(TokenType.EndOfInput)) {
                throw new Error(Report.error(this.currentToken.line, this.currentToken.column, `Unexpected end of input.`));

            } else {
                throw new Error(Report.error(this.currentToken.line, this.currentToken.column, `Unexpected token '${this.currentToken.value}'.`));
            }

        } while (!this.accept(TokenType.RightBrace) && !this.accept(TokenType.EndOfInput));

        this.expect(TokenType.RightBrace);
    }

    parseDispatch() {
        let expression = this.parseValue();

        while (this.accept(TokenType.Dot)) {
            this.expect(TokenType.Dot);

            let call = this.parseFunctionCall();

            call.object = expression;

            expression = call;
        }

        return expression;
    }

    parseValue() {
        let token = this.currentToken;

        if (this.accept(TokenType.EndOfInput)) {
            throw new Error(Report.error(token.line, token.column, 'Unexpected end of input.'));
        }

        let value = null;

        if (this.accept(TokenType.Integer)) {
            value = new IntegerLiteral(this.expect(TokenType.Integer).value);

        } else if (this.accept(TokenType.Decimal)) {
            value = new DecimalLiteral(this.expect(TokenType.Decimal).value);

        } else if (this.accept(TokenType.String)) {
            value = new StringLiteral(this.expect(TokenType.String).value);

        } else if (this.accept(TokenType.Null)) {
            value = this.parseNull();

        } else if (this.accept(TokenType.True) || this.accept(TokenType.False)) {
            value = new BooleanLiteral(this.currentToken.value);

            this.currentToken = this.lexer.nextToken();

        } else if (this.accept(TokenType.If)) {
            value = this.parseIfElse();

        } else if (this.accept(TokenType.While)) {
            value = this.parseWhile();

        } else if (this.accept(TokenType.Let)) {
            value = this.parseLet();

        } else if (this.accept(TokenType.LeftBrace)) {
            value = this.parseBlock();

        } else if (this.accept(TokenType.New)) {
            value = this.parseConstructorCall();

        } else if (this.accept(TokenType.This)) {
            value = this.parseThis();

        } else if (this.accept(TokenType.Super)) {
            value = this.parseSuperFunctionCall();

        } else if (this.acceptUnaryOperator()) {
            let operator = this.currentToken.value;

            this.currentToken = this.lexer.nextToken();

            value = new UnaryExpression(operator, this.parseValue());

        } else if (this.accept(TokenType.Not)) {
            value = new UnaryExpression(this.expect(TokenType.Not).value, this.parseExpression());

        } else if (this.accept(TokenType.Minus)) {
            value = new UnaryExpression(this.expect(TokenType.Minus).value, this.parseExpression());

        } else if (this.accept(TokenType.LeftParen)) {
            this.expect(TokenType.LeftParen);

            value = this.parseExpression();

            this.expect(TokenType.RightParen);

        } else if (this.accept(TokenType.Identifier)) {
            let lookahead = this.lexer.lookahead();

            if (lookahead.type === TokenType.Equal || lookahead.type === TokenType.PlusEqual
                || lookahead.type === TokenType.MinusEqual || lookahead.type === TokenType.TimesEqual
                || lookahead.type === TokenType.DivEqual || lookahead.type === TokenType.ModuloEqual) {
                value = this.parseAssignment();

            } else if (lookahead.type === TokenType.LeftParen) {
                value = this.parseFunctionCall();

            } else {
                value = new Reference(this.expect(TokenType.Identifier).value);
            }
        }

        if (value === null) {
            throw new Error(`Unexpected '${token.value}' at ${token.line + 1}:${token.column + 1}.`);
        }

        value.line = token.line;
        value.column = token.column;

        return value;
    }

    accept(tokenType) {
        if (tokenType !== TokenType.Newline) {
            this.discardNewlines();
        }

        if (tokenType !== TokenType.EndOfInput && this.currentToken.type === Token.EndOfInput) {
            return false;
        }

        return this.currentToken.type === tokenType;
    }

    expect(tokenType) {
        if (tokenType !== TokenType.Newline) {
            this.discardNewlines();
        }

        let token = new Token(this.currentToken.type, this.currentToken.value, this.currentToken.line, this.currentToken.column);

        if (tokenType !== TokenType.EndOfInput && token.type === TokenType.EndOfInput) {
            throw new Error(Report.error(token.line, token.column, `Expected '${tokenType}' but reached end of input.`));
        }

        if (token.type !== tokenType) {
            throw new Error(Report.error(token.line, token.column, `Expected '${tokenType}' but found '${token.value}'.`));
        }

        this.currentToken = this.lexer.nextToken();

        return token;
    }

    acceptOperator() {
        return this.acceptAdditiveOperator() || this.acceptComparisonOperator()
            || this.acceptMultiplicativeOperator() || this.acceptBooleanOperator()
            || this.acceptOtherOperator();
    }

    acceptCastOperator() {
        return this.accept(TokenType.As);
    }

    acceptAdditiveOperator() {
        return this.acceptOneOf(TokenType.Plus, TokenType.Minus);
    }

    acceptMultiplicativeOperator() {
        return this.acceptOneOf(TokenType.Times, TokenType.Div, TokenType.Modulo);
    }

    acceptComparisonOperator() {
        return this.acceptOneOf(TokenType.Less, TokenType.LessOrEqual, TokenType.Greater,
            TokenType.GreaterOrEqual, TokenType.DoubleEqual, TokenType.NotEqual);
    }

    acceptBooleanOperator() {
        return this.acceptOneOf(TokenType.And, TokenType.Or, TokenType.DoubleEqual, TokenType.NotEqual);
    }

    acceptAssignmentOperator() {
        return this.acceptOneOf(TokenType.Equal, TokenType.PlusEqual, TokenType.MinusEqual,
            TokenType.TimesEqual, TokenType.DivEqual, TokenType.ModuloEqual);
    }

    acceptUnaryOperator() {
        return this.acceptOneOf(TokenType.Plus, TokenType.Minus, TokenType.Times,
            TokenType.Div, TokenType.Modulo, TokenType.Tilde, TokenType.Dollar, TokenType.Caret);
    }

    acceptOtherOperator() {
        return this.acceptOneOf(TokenType.Tilde, TokenType.TildeEqual, TokenType.Dollar,
            TokenType.DollarEqual, TokenType.Caret, TokenType.CaretEqual);
    }

    acceptOneOf(...tokenTypes) {
        if (tokenTypes.indexOf(TokenType.Newline) < 0) {
            this.discardNewlines();
        }

        let type = this.currentToken.type;

        if (type === TokenType.EndOfInput) {
            return false;
        }

        return tokenTypes.indexOf(type) >= 0;
    }

    discardNewlines() {
        while (this.currentToken.type === TokenType.Newline) {
            this.currentToken = this.lexer.nextToken();
        }
    }
}
