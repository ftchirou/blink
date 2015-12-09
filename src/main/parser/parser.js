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
import { Program } from '../ast/program'
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

    parseProgram() {
        let program = new Program();

        while (!this.accept(TokenType.EndOfInput)) {
            program.classes.push(this.parseClass());
        }

        return program;
    }

    parseDefinition() {
        let token = this.currentToken;

        let definition = null;

        if (this.accept(TokenType.Class)) {
            definition = this.parseClass();
        }

        if (this.accept(TokenType.Override) || this.accept(TokenType.Def)) {
            definition = this.parseMethod();
        }

        if (definition === null) {
            throw new Error(`Unexpected '${token.type}' at ${token.line + 1}:${token.column + 1}.`);
        }

        return definition;
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
        let classToken = this.expect(TokenType.Class);

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

        klass.line = classToken.line;
        klass.column = classToken.column;

        return klass;
    }

    parseClassBody(klass) {
        this.expect(TokenType.LeftBrace);

        do {
            if (this.accept(TokenType.RightBrace)) {
                break;
            }

            if (this.accept(TokenType.Var)) {
                klass.variables.push(this.parseVariable());

            } else if (this.accept(TokenType.Def) || this.accept(TokenType.Override)) {
                klass.methods.push(this.parseMethod());
            }

        } while (!this.accept(TokenType.RightBrace));

        this.expect(TokenType.RightBrace);
    }

    parseVariable() {
        let varToken = this.expect(TokenType.Var);

        let variable = new Variable();

        variable.name = this.expect(TokenType.Identifier).value;

        this.expect(TokenType.Colon);

        variable.type = this.expect(TokenType.Identifier).value;

        if (this.accept(TokenType.Equal)) {
            this.expect(TokenType.Equal);

            variable.value = this.parseExpression();
        }

        variable.line = varToken.line;
        variable.column = varToken.column;

        return variable;
    }

    parseMethod() {
        let overrideToken = null;

        let override = false;

        if (this.accept(TokenType.Override)) {
            overrideToken = this.expect(TokenType.Override);

            override = true;
        }

        let defToken = this.expect(TokenType.Def);

        let method = new Method();

        method.override = override;

        method.name = this.expect(TokenType.Identifier).value;

        method.parameters = this.parseFormals();

        if (this.accept(TokenType.Colon)) {
            this.expect(TokenType.Colon);

            method.returnType = this.expect(TokenType.Identifier).value;
        }

        this.expect(TokenType.Equal);

        method.body = this.parseExpression();

        method.line = override ? overrideToken.line : defToken.line;
        method.column = override ? overrideToken.column : defToken.column;

        return method;
    }

    parseFormals() {
        this.expect(TokenType.LeftParen);

        let formals = [];

        if (!this.accept(TokenType.RightParen)) {
            do {
                if (this.accept(TokenType.Comma)) {
                    this.expect(TokenType.Comma);
                }

                let nameToken = this.expect(TokenType.Identifier);

                this.expect(TokenType.Colon);

                let type = this.expect(TokenType.Identifier).value;

                formals.push(new Formal(nameToken.value, type, nameToken.line, nameToken.column));

            } while (this.accept(TokenType.Comma));
        }

        this.expect(TokenType.RightParen);

        return formals;
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
        let token = this.currentToken;

        let value = null;

        if (this.accept(TokenType.Integer)) {
            value = new IntegerLiteral(this.expect(TokenType.Integer).value);

        } else if (this.accept(TokenType.Decimal)) {
            value = new DecimalLiteral(this.expect(TokenType.Decimal).value);

        } else if (this.accept(TokenType.String)) {
            value = new StringLiteral(this.expect(TokenType.String).value);

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

            if (lookahead.type === TokenType.Equal) {
                value = this.parseAssignment();

            } else if (lookahead.type === TokenType.LeftParen) {
                value = this.parseMethodCall();

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
            throw new Error(`Expected '${tokenType}' but reached end of input.`);
        }

        if (token.type !== tokenType) {
            throw new Error(`Expected '${tokenType}' but found '${token.type}' at ${token.line + 1}:${token.column + 1}.`);
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