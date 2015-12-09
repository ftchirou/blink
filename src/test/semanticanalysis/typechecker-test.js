import * as assert from 'assert'
import { Class } from '../../main/ast/class'
import { Environment } from '../../main/semanticanalysis/environment'
import { Parser } from '../../main/parser/parser'
import { TypeChecker } from '../../main/semanticanalysis/typechecker'

describe('TypeChecker', () => {

    describe('#typeCheck', () => {
        it('should throw an error if trying to assign to value of a different type than the one declared', () => {
           let parser = new Parser(
               'let x: Int in x = "Hello"'
           );

           let env = new Environment();
           env.addClass(new Class('Object'));
           env.addClass(new Class('Int', [], 'Object'));
           env.addClass(new Class('String', [], 'String'));

           assert.throws(() => {
               TypeChecker.typeCheck(env, parser.parseExpression());
           }, Error, "Cannot assign value of type 'String' to variable 'x' declared with type 'Int'.");

        });

        it('should infer the type of a variable during initialization if the type is not specified', () => {
            let parser = new Parser('let x = 42 in x');

            let expression = parser.parseExpression();

            let env = new Environment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));

            TypeChecker.typeCheck(env, expression);

            let init = expression.initializations[0];

            assert.equals('Int', init.type);
            assert.equals('Int', init.expressionType);
        });

        it('should not throw an error if the assignment is valid', () => {
            let parser = new Parser(
                'let x: Int in x = 42'
            );

            let env = new Environment();
            env.addClass(new Class('Object'));
            env.addClass(new Class('Int', [], 'Object'));
            env.addClass(new Class('String', [], 'String'));

            TypeChecker.typeCheck(env, parser.parseExpression());

        });

    });

});