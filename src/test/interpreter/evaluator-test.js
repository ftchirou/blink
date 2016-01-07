import * as assert from 'assert'
import { Class } from '../../main/ast/class'
import { Context } from '../../main/interpreter/context'
import { Evaluator } from '../../main/interpreter/evaluator'
import { BoolClass } from '../../main/interpreter/std/bool'
import { DoubleClass } from '../../main/interpreter/std/double'
import { IntClass } from '../../main/interpreter/std/int'
import { ObjectClass } from '../../main/interpreter/std/object'
import { Parser } from '../../main/parser/parser'
import { StringClass } from '../../main/interpreter/std/str'
import { TypeChecker } from '../../main/semanticanalysis/typechecker'
import { TypeEnvironment } from '../../main/semanticanalysis/typeenvironment'
import { UnitClass } from '../../main/interpreter/std/unit'

describe('Evaluator', () => {

   describe('#evaluate', () => {

       let typeEnv = new TypeEnvironment();
       let context = new Context();

       before(() => {
           let boolClass = new BoolClass();
           let doubleClass = new DoubleClass();
           let objectClass = new ObjectClass();
           let intClass = new IntClass();
           let stringClass = new StringClass();
           let unitClass = new UnitClass();

           typeEnv.addClass(boolClass);
           typeEnv.addClass(doubleClass);
           typeEnv.addClass(objectClass);
           typeEnv.addClass(intClass);
           typeEnv.addClass(stringClass);
           typeEnv.addClass(unitClass);

           context.addClass(boolClass);
           context.addClass(doubleClass);
           context.addClass(objectClass);
           context.addClass(intClass);
           context.addClass(stringClass);
           context.addClass(unitClass);
       });

       beforeEach(() => {
           typeEnv.symbolTable.clear();
       });

       it('should evaluate a boolean literal', () => {
           let source = 'false';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal(false, value.get('value'));
       });

       it('should evaluate an integer literal', () => {
           let source = '42';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal(42, value.get('value'));
       });

       it('should evaluate a decimal literal', () => {
           let source = '3.14';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal(3.14, value.get('value'));
       });

       it('should evaluate a string literal', () => {
           let source = '"Hello, world!"';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal('Hello, world!', value.get('value'));
       });

       it('should evaluate string concatenation', () => {
           let source = '"Hello" + " world!"';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal('Hello world!', value.get('value'));
       });

       it('should evaluate an integer addition', () => {
           let source = '1 + 2 + 3 + 4 + 5';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal(15, value.get('value'));
       });

       it('should evaluate an if/else expression', () => {
           let source = 'if (2 < 3) { 42 } else { 21 }';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal('Int', value.type);
           assert.equal(42, value.get('value'));
       });

       it('should evaluate a constructor call', () => {
           let fractionClassSource =
               'class Fraction(n: Int, d: Int) {\n' +
                    'var num: Int = n\n' +
                    'var den: Int = d\n' +
               '}';

           let fractionClass = (new Parser(fractionClassSource)).parseClass();

           typeEnv.addClass(fractionClass);
           context.addClass(fractionClass);

           TypeChecker.typeCheckClass(typeEnv, fractionClass);

           let source = 'new Fraction(3, 4)';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           let value = Evaluator.evaluate(context, expression);

           assert.equal('Fraction', value.type);

           assert.equal(true, value.has('num'));
           assert.equal(true, value.has('den'));

           assert.equal(3, value.get('num').get('value'));
           assert.equal(4, value.get('den').get('value'));
       });

       it('should evaluate a simple method call', () => {
           let fractionClassSource =
               'class Fraction(n: Int, d: Int) {\n' +
                    'var num: Int = n\n' +
                    'var den: Int = d\n' +
                    '' +
                    'override func toString(): String = num.toString() + "/" + den.toString()\n' +
               '}';

           let fractionClass = (new Parser(fractionClassSource)).parseClass();

           typeEnv.addClass(fractionClass);
           context.addClass(fractionClass);

           TypeChecker.typeCheckClass(typeEnv, fractionClass);

           let source = 'let f = new Fraction(3, 4) in f.toString()';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           context.environment.enterScope();

           let value = Evaluator.evaluate(context, expression);

           context.environment.exitScope();

           assert.equal('3/4', value.get('value'));
       });

       it('should evaluate a reference', () => {
           let source = 'let n = 42 in n';

           let expression = (new Parser(source)).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           context.environment.enterScope();

           let value = Evaluator.evaluate(context, expression);

           context.environment.exitScope();

           assert.equal(42, value.get('value'));
       });

       it('should evaluate a while expression', () => {
           let source =
               'let counter = 0 in {\n' +
                    'while (counter < 10) {\n' +
                        'counter = counter + 1\n' +
                    '}\n' +
                    'counter\n' +
               '}';

           let expression = new Parser(source).parseExpression();

           TypeChecker.typeCheck(typeEnv, expression);

           context.environment.enterScope();

           let value = Evaluator.evaluate(context, expression);

           context.environment.exitScope();

           assert.equal(10, value.get('value'));
       });
   });
});