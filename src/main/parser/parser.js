import { Assignment } from '../ast/assignment'
import { BinaryExpression } from '../ast/binaryexpression'
import { Block } from '../ast/block'
import { BooleanLiteral } from '../ast/boolean'
import { Class } from '../ast/class'
import { ConstructorCall } from '../ast/constructorcall'
import { DecimalLiteral } from '../ast/decimal'
import { Initialization } from '../ast/initialization'
import { Formal } from '../ast/formal'
import { IfElse } from '../ast/ifelse'
import { IntegerLiteral } from '../ast/integer'
import { Let } from '../ast/let'
import { Lexer } from '../lexer/lexer'
import { Method } from '../ast/method'
import { MethodCall } from '../ast/methodcall'
import { Reference } from '../ast/reference'
import { StringLiteral } from '../ast/string'
import { TokenType } from '../lexer/tokentype'
import { Token } from '../lexer/token'
import { UnaryExpression } from '../ast/unaryexpression'
import { Variable } from '../ast/variable'
import { While } from '../ast/while'

export class Parser {

    constructor(input) {
        this.lexer = new Lexer(input);
        this.currentToken = this.lexer.nextToken();
    }

    parseDefinition() {
        if (this.accept(TokenType.Class)) {
            return this.parseClass();
        }

        if (this.accept(TokenType.Override) || this.accept(TokenType.Def)) {
            return this.parseMethod();
        }

        var token = this.currentToken;

        throw new Error(`Unexpected '${token.type}' at ${token.line + 1}:${token.column + 1}.`)
    }

    parseExpression() {
        return this.parseBooleanExpression();
    }

    parseBooleanExpression() {
        return this.parseBinaryExpression(this.acceptBooleanOperator, this.parseComparison);
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

    parseAssignment() {
        var assignment = new Assignment();

        assignment.identifier = this.expect(TokenType.Identifier).value;

        this.expect(TokenType.Equal);

        assignment.value = this.parseExpression();

        return assignment;
    }

    parseMethodCall() {
        var call = new MethodCall();

        call.methodName = this.expect(TokenType.Identifier).value;

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

    parseWhile() {
        this.expect(TokenType.While);

        var whileExpr = new While();

        this.expect(TokenType.LeftParen);

        whileExpr.condition = this.parseExpression();

        this.expect(TokenType.RightParen);

        whileExpr.body = this.parseExpression();

        return whileExpr;
    }

    parseLet() {
        this.expect(TokenType.Let);

        var letExpr = new Let();

        letExpr.initializations = this.parseInitializations();

        this.expect(TokenType.In);

        letExpr.body = this.parseExpression();

        return letExpr;
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

    parseConstructorCall() {
        this.expect(TokenType.New);

        let call = new ConstructorCall();

        call.type = this.expect(TokenType.Identifier).value;

        call.args = this.parseActuals();

        return call;
    }

    parseInitializations() {
        let initializations = [];

        do {

            if (this.accept(TokenType.Comma)) {
                this.expect(TokenType.Comma);
            }

            let initialization = new Initialization();

            initialization.identifier = this.expect(TokenType.Identifier).value;

            if (this.accept(TokenType.Colon)) {
                this.expect(TokenType.Colon);

                initialization.type = this.expect(TokenType.Identifier).value;
            }

            if (this.accept(TokenType.Equal)) {
                this.expect(TokenType.Equal);

                initialization.value = this.parseExpression();
            }

            initializations.push(initialization);

        } while (this.accept(TokenType.Comma));

        return initializations;
    }

    parseClass() {
        this.expect(TokenType.Class);

        let klass = new Class(this.expect(TokenType.Identifier).value);

        if (this.accept(TokenType.LeftParen)) {
            klass.parameters = this.parseFormals();
        }

        if (this.accept(TokenType.Extends)) {
            this.expect(TokenType.Extends);

            klass.superClass = this.expect(TokenType.Identifier).value;

            if (this.accept(TokenType.LeftParen)) {
                klass.superClassArgs = this.parseActuals();
            }
        }

        this.parseClassBody(klass);

        return klass;
    }

    parseClassBody(klass) {
        this.expect(TokenType.LeftBrace);

        do {
            while (this.accept(TokenType.Newline)) {
                this.expect(TokenType.Newline);
            }

            if (this.accept(TokenType.Var)) {
                klass.properties.push(this.parseVariable());

            } else if (this.accept(TokenType.Def) || this.accept(TokenType.Override)) {
                klass.methods.push(this.parseMethod());
            }

        } while (this.accept(TokenType.Newline));

        this.expect(TokenType.RightBrace);
    }

    parseVariable() {
        this.expect(TokenType.Var);

        let variable = new Variable();

        variable.name = this.expect(TokenType.Identifier).value;

        this.expect(TokenType.Colon);

        variable.type = this.expect(TokenType.Identifier).value;

        if (this.accept(TokenType.Equal)) {
            this.expect(TokenType.Equal);

            variable.value = this.parseExpression();
        }

        return variable;
    }

    parseMethod() {
        let method = new Method();

        if (this.accept(TokenType.Override)) {
            this.expect(TokenType.Override);

            method.overriding = true;
        }

        method.name = this.expect(TokenType.Identifier).value;

        method.parameters = this.parseFormals();

        if (this.accept(TokenType.Colon)) {
            this.expect(TokenType.Colon);

            method.returnType = this.expect(TokenType.Identifier).value;
        }

        this.expect(TokenType.Equal);

        method.body = this.parseExpression();
    }

    parseFormals() {
        this.expect(TokenType.LeftParen);

        let formals = [];

        do {
            if (this.accept(TokenType.Comma)) {
                this.expect(TokenType.Comma);
            }

            let name = this.expect(TokenType.Identifier).value;

            this.expect(TokenType.Colon);

            let type = this.expect(TokenType.Identifier);

            formals.push(new Formal(name, type));

        } while (this.accept(TokenType.Comma));

        this.expect(TokenType.RightParen);

        return formals;
    }

    parseActuals() {
        this.expect(TokenType.LeftParen);

        let actuals = [];

        do {
            if (this.accept(TokenType.Comma)) {
                this.expect(TokenType.Comma);
            }

            actuals.push(this.parseExpression());

        } while (this.accept(TokenType.Comma));

        this.expect(TokenType.RightParen);

        return actuals;
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

    parseDispatch() {
        let expression = this.parseValue();

        while (this.accept(TokenType.Dot)) {
            this.expect(TokenType.Dot);

            let call = this.parseMethodCall();

            call.object = expression;

            expression = call;
        }

        return expression;
    }

    parseValue() {
        if (this.accept(TokenType.Integer)) {
            return new IntegerLiteral(this.expect(TokenType.Integer).value);

        } else if (this.accept(TokenType.Decimal)) {
            return new DecimalLiteral(this.expect(TokenType.Decimal).value);

        } else if (this.accept(TokenType.String)) {
            return new StringLiteral(this.expect(TokenType.String).value);

        } else if (this.accept(TokenType.True) || this.accept(TokenType.False)) {
            var bool = new BooleanLiteral(this.currentToken.value);

            this.currentToken = this.lexer.nextToken();

            return bool;

        } else if (this.accept(TokenType.If)) {
            return this.parseIfElse();

        } else if (this.accept(TokenType.While)) {
            return this.parseWhile();

        } else if (this.accept(TokenType.Let)) {
            return this.parseLet();

        } else if (this.accept(TokenType.LeftBrace)) {
            return this.parseBlock();

        } else if (this.accept(TokenType.New)) {
            return this.parseConstructorCall();

        } else if (this.accept(TokenType.Not)) {
            return new UnaryExpression(this.expect(TokenType.Not).value, this.parseExpression());

        } else if (this.accept(TokenType.Minus)) {
            return new UnaryExpression(this.expect(TokenType.Minus).value, this.parseExpression());

        } else if (this.accept(TokenType.LeftParen)) {
            this.expect(TokenType.LeftParen);

            let expression = this.parseExpression();

            this.expect(TokenType.RightParen);

            return expression;

        } else if (this.accept(TokenType.Identifier)) {
            let lookahead = this.lexer.lookahead();

            if (lookahead.type === TokenType.Equal) {
                return this.parseAssignment();
            }

            if (lookahead.type === TokenType.LeftParen) {
                return this.parseMethodCall();
            }

            return new Reference(this.expect(TokenType.Identifier).value);
        }

        let token = this.currentToken;

        throw new Error(`Unexpected '${token.type}:${token.value}' at ${token.line + 1}:${token.column + 1}.`);
    }

    accept(tokenType) {
        if (tokenType !== TokenType.Newline) {
            this.discardNewlines();
        }

        return this.currentToken.type !== TokenType.EndOfInput && this.currentToken.type === tokenType;
    }

    expect(tokenType) {
        if (tokenType !== TokenType.Newline) {
            this.discardNewlines();
        }

        let token = new Token(this.currentToken.type, this.currentToken.value, this.currentToken.line, this.currentToken.column);

        if (token.type === TokenType.EndOfInput) {
            throw new Error(`Expected ${tokenType} but reached end of input.`);
        }

        if (token.type !== tokenType) {
            throw new Error(`Expected ${tokenType} but found ${token.type} at ${token.line + 1}:${token.column + 1}.`);
        }

        this.currentToken = this.lexer.nextToken();

        return token;
    }

    acceptAdditiveOperator() {
        return this.acceptOneOf(TokenType.Plus, TokenType.Minus);
    }

    acceptMultiplicativeOperator() {
        return this.acceptOneOf(TokenType.Times, TokenType.Div, TokenType.Modulo);
    }

    acceptComparisonOperator() {
        return this.acceptOneOf(TokenType.Less, TokenType.LessOrEqual, TokenType.Greater,
            TokenType.GreaterOrEqual, TokenType.DoubleEqual);
    }

    acceptBooleanOperator() {
        return this.acceptOneOf(TokenType.And, TokenType.Or);
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