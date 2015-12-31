import * as assert from 'assert'
import { BuiltInTypes } from '../../main/semanticanalysis/typeenvironment'
import { Class } from '../../main/ast/class'
import { TypeEnvironment } from '../../main/semanticanalysis/typeenvironment'
import { Parser } from '../../main/parser/parser'
import { TypeChecker } from '../../main/semanticanalysis/typechecker'

describe('TypeChecker', () => {

    describe('#typeCheck', () => {
        it('should throw an error if trying to assign to value of a different type than the one declared', () => {
           let parser = new Parser(
               'let x: Int in x = "Hello"'
           );

           let env = new TypeEnvironment();
           env.addClass(new Class('Object'));
           env.addClass(new Class('Int', [], 'Object'));
           env.addClass(new Class('String', [], 'String'));

           assert.throws(() => {
               TypeChecker.typeCheck(env, parser.parseExpression());
           }, Error, "Cannot assign value of type 'String' to variable 'x' declared with type 'Int'.");

        });

        it('should throw an error if trying to assign to a non declared variable', () => {
            let parser = new Parser(
                'let x: Int in y = 42'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseExpression())
            }, Error, `1:15: Assignment to an undefined variable 'y'.`);
        });

        it('should throw an error if trying to reference to a non declared variable', () => {
            let parser = new Parser(
                'let x: Double in y + x'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Double', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseExpression())
            }, Error, `1:18: Reference to an undefined identifier 'y'.`);
        });

        it('should infer the type of a variable during initialization if the type is not specified', () => {
            let parser = new Parser('let x = 42 in x');

            let expression = parser.parseExpression();

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            TypeChecker.typeCheck(env, expression);

            let init = expression.initializations[0];

            assert.equal('Int', init.type);
            assert.equal('Int', init.expressionType);
        });

        it('should not throw an error if the assignment is valid', () => {
            let parser = new Parser(
                'let x: Int in x = 42'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));
            env.addClass(new Class('String', [], 'Object'));

            TypeChecker.typeCheck(env, parser.parseExpression());
        });

        it('should throw an error if there are 2 variables with the same name in a let binding', () => {
            let parser = new Parser(
                'let x: Int = 42, x: Double = 3.14 in x + y'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));
            env.addClass(new Class('Double', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseExpression())
            }, Error, `1:18: Duplicate identifier 'x' in let binding.`);
        });

        it('should throw an error if a method has 2 parameters of the same name', () => {
            let parser = new Parser(
                'func add(x: Int, x: Double): Double = {' +
                    'x + x' +
                '}'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));
            env.addClass(new Class('String', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseMethod())
            }, Error, `1:17: Duplicate parameter name 'x' in method 'add'.`);
        });

        it('should throw an error if a class has 2 parameters of the same name', () => {
            let parser = new Parser(
                'class Complex(x: Int, x: Int) {' +
                    'var a: Int = x' +
                    '\n' +
                    'var b: Int = x' +
                    '\n' +
                    'func toString(): String = a + "+" + b + "i"' +
                '}'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseClass())
            }, Error, `1:23: Duplicate class parameter name 'x' in class 'Complex' definition.`);
        });

        it('should throw an error if a class has 2 instance variables of the same name', () => {
            let parser = new Parser(
                'class Complex(x: Int, y: Int) {' +
                    'var a: Int = x' +
                    '\n' +
                    'var a: Int = y' +
                    '\n' +
                    'def toString(): String = "a complex"' +
                    '\n' +
                ''
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseClass())
            }, Error, `2:1: An instance variable named 'a' is already in scope.`);
        });

        it('should throw an error if the condition of an if/else does not evaluate to a boolean value', () => {
            let parser = new Parser(
                'if (42) true else false'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseExpression())
            }, Error, `1:5: Condition of the if/else expression evaluates to a value of type 'Int', must evaluate to a boolean value.`);
        });

        it('should throw an error if the condition of a while expression does not evaluate to a boolean value', () => {
            let parser = new Parser(
                'while ("hello") true'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('String', [], 'Object'));

            assert.throws(() => {
                TypeChecker.typeCheck(env, parser.parseExpression())
            }, Error, `1:8: Condition of a while loop evaluates to a value of type 'String', must evaluate to a boolean value.`);
        });

        it('should set the type of an if/else expression to the LUB of its 2 branches', () => {
            let parser = new Parser(
                'if (true) new Bretzel() else new Cat()'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Bool', [], 'Object'));
            env.addClass(new Class('Animal', [], 'Object'));
            env.addClass(new Class('Dog', [], 'Animal'));
            env.addClass(new Class('Cat', [], 'Animal'));
            env.addClass(new Class('Bretzel', [], 'Dog'));

            let ifElse = parser.parseExpression();

            TypeChecker.typeCheck(env, ifElse);

            assert.equal('Bretzel', ifElse.thenBranch.expressionType);
            assert.equal('Cat', ifElse.elseBranch.expressionType);
            assert.equal('Animal', ifElse.expressionType);
        });

        it('should set the type of an if/else expression to Unit if the else branch is missing', () => {
            let parser = new Parser(
                'if (true) 42'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Bool', [], 'Object'));
            env.addClass(new Class('Int', [], 'Object'));

            let ifElse = parser.parseExpression();

            TypeChecker.typeCheck(env, ifElse);

            assert.equal(BuiltInTypes.Int, ifElse.thenBranch.expressionType);
            assert.equal(BuiltInTypes.Unit, ifElse.expressionType);
        });

        it('should set the type of a while expression to Unit', () => {
            let parser = new Parser(
                'while (true) 42'
            );

            let env = new TypeEnvironment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Bool', [], 'Object'));
            env.addClass(new Class('Int', [], 'Object'));

            let whileExpr = parser.parseExpression();

            TypeChecker.typeCheck(env, whileExpr);

            assert.equal(BuiltInTypes.Unit, whileExpr.expressionType);
        });
    });

});