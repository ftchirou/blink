import * as assert from 'assert'
import { Expression } from '../../main/ast/expression'
import { Parser } from '../../main/parser/parser'

describe('Parser', () => {

    describe('#parseExpression', () => {

        it('should parse a simple integer literal', () => {
            let parser = new Parser('42');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isIntegerLiteral());
            assert.equal('42', expression.value);
        });

        it('should parse a simple decimal literal', () => {
            let parser = new Parser('3.14159');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isDecimalLiteral());
            assert.equal('3.14159', expression.value);
        });

        it('should parse a simple string literal', () => {
            let parser = new Parser('"Hello, World!"');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isStringLiteral());
            assert.equal('"Hello, World!"', expression.value);
        });

        it('should parse the boolean literal "true"', () => {
            let parser = new Parser('true');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isBooleanLiteral());
            assert.equal('true', expression.value);
        });

        it('should parse the boolean literal "false"', () => {
            let parser = new Parser('false');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isBooleanLiteral());
            assert.equal('false', expression.value);
        });

        it('should parse a simple addition', () => {
            let parser = new Parser('1 + 2');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isBinaryExpression());

            assert.equal('+', expression.operator);

            assert.equal(true, expression.left.isIntegerLiteral());
            assert.equal('1', expression.left.value);

            assert.equal(true, expression.right.isIntegerLiteral());
            assert.equal('2', expression.right.value);
        });

        it('should correctly handle left associativity for arithmetic operators', () => {
            let parser = new Parser('7 - 4 + 2');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isBinaryExpression());

            assert.equal('+', expression.operator);

            assert.equal(true, expression.left.isBinaryExpression());

            assert.equal('-', expression.left.operator);

            assert.equal(true, expression.left.left.isIntegerLiteral());
            assert.equal('7', expression.left.left.value);

            assert.equal(true, expression.left.right.isIntegerLiteral());
            assert.equal('4', expression.left.right.value);

            assert.equal(true, expression.right.isIntegerLiteral());
            assert.equal('2', expression.right.value);
        });

        it('should correctly handle operator precedence', () => {
            let parser = new Parser('1 + 3 * 5 - 8');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isBinaryExpression());
            assert.equal('-', expression.operator);

            let left = expression.left;

            assert.equal(true, left.isBinaryExpression());
            assert.equal('+', left.operator);
            assert.equal(true, left.left.isIntegerLiteral());
            assert.equal('1', left.left.value);

            let multiplication = left.right;

            assert.equal(true, multiplication.isBinaryExpression());
            assert.equal('*', multiplication.operator);
            assert.equal(true, multiplication.left.isIntegerLiteral());
            assert.equal('3', multiplication.left.value);
            assert.equal(true, multiplication.right.isIntegerLiteral());
            assert.equal('5', multiplication.right.value);

            let right = expression.right;
            assert.equal(true, right.isIntegerLiteral());
            assert.equal('8', right.value);
        });

        it('should parse an if/else expression', () => {
            let parser = new Parser('if (true) 1 else 2');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isIfElse());

            assert.equal(true, expression.thenBranch.isIntegerLiteral());
            assert.equal('1', expression.thenBranch.value);

            assert.equal(true, expression.elseBranch.isIntegerLiteral());
            assert.equal('2', expression.elseBranch.value);
        });

        it('should parse a while expression', () => {
            let parser = new Parser('while (true) 42');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isWhile());

            assert.equal(true, expression.condition.isBooleanLiteral());
            assert.equal('true', expression.condition.value);

            assert.equal(true, expression.body.isIntegerLiteral());
            assert.equal('42', expression.body.value);
        });

        it('should parse a let expression', () => {
            let parser = new Parser('let a: Int = 2, b = 3 in a + b');

            let expression = parser.parseExpression();

            assert.equal(true, expression.isLet());

            let initializations = expression.initializations;
            assert.equal(2, initializations.length);

            assert.equal(initializations[0].identifier, 'a');
            assert.equal(initializations[0].type, 'Int');
            assert.equal(true, initializations[0].value.isIntegerLiteral());
            assert.equal('2', initializations[0].value.value);

            assert.equal(initializations[1].identifier, 'b');
            assert.equal(initializations[1].type, undefined);
            assert.equal(true, initializations[1].value.isIntegerLiteral());
            assert.equal('3', initializations[1].value.value);

            let body = expression.body;

            assert.equal(true, body.isBinaryExpression());

            assert.equal('+', body.operator);
            assert.equal(true, body.left.isReference());
            assert.equal('a', body.left.identifier);

            assert.equal(true, body.right.isReference());
            assert.equal('b', body.right.identifier);
        });

        it('should parse a block of expressions', () => {
            var parser = new Parser('{\n' +
                   '"hello"\n' +
                   '42\n' +
                   'true\n' +
               '}');

            var expression = parser.parseExpression();

            assert.equal(true, expression.isBlock());

            var expressions = expression.expressions;

            assert.equal(3, expressions.length);

            assert.equal(true, expressions[0].isStringLiteral());
            assert.equal('"hello"', expressions[0].value);

            assert.equal(true, expressions[1].isIntegerLiteral());
            assert.equal('42', expressions[1].value);

            assert.equal(true, expressions[2].isBooleanLiteral());
            assert.equal('true', expressions[2].value);
        });

        it('should parse a constructor call', () => {
            var parser = new Parser('new Integer(42)');

            var expression = parser.parseExpression();

            assert.equal(true, expression.isConstructorCall());
            assert.equal('Integer', expression.type);
            assert.equal(1, expression.args.length);
            assert.equal(true, expression.args[0].isIntegerLiteral());
            assert.equal('42', expression.args[0].value);
        });

        it('should parse a dispatch on a reference', () => {
            var parser = new Parser('car.drive(2)');

            var expression = parser.parseExpression();

            assert.equal(true, expression.isMethodCall());

            var object = expression.object;
            assert.equal(true, object.isReference());
            assert.equal('car', object.identifier);

            assert.equal(expression.methodName, 'drive');

            assert.equal(1, expression.args.length);
            assert.equal(true, expression.args[0].isIntegerLiteral());
            assert.equal('2', expression.args[0].value);
        });
    });
});