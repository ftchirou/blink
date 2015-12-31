import * as assert from 'assert'
import { Parser } from '../../main/parser/parser'
import { SemanticAnalyzer } from '../../main/semanticanalysis/semanticanalyzer'

describe('SemanticAnalyzer', () => {

    describe('#runAnalysis', () => {

        it('should throw an error if there is no class named "Main" in the program', () => {
            let parser = new Parser(
                'class Fraction(n: Int, d: Int) {\n' +
                    'var num: Int = n\n' +
                    '' +
                    'var den: Int = d\n' +
                    '' +
                    'func gcd(): Int = {\n' +
                    '    let a = num, b = den in {\n' +
                    '        if (b == 0) a else gcd(b, a % b)\n' +
                    '    }\n' +
                    '}\n' +
                    '' +
                    'override func toString(): String = n.toString() + "/" + d.toString()' +
                '}\n' +
                '\n' +
                'class Complex(a: Double, b: Double) {\n' +
                    'var x: Double = a\n' +
                    '' +
                    'var y: Double = b\n' +
                    '' +
                    'override func toString(): String = x.toString() + " + " + b.toString() + "i"' +
                '}');

            let program = parser.parseProgram();

            let analyzer = new SemanticAnalyzer(program);

            assert.throws(() => {
                analyzer.runAnalysis()
            }, Error, `'Main' class not found.`);
        });

        it('should throw an error if there is a Main class which does not have a main method', () => {
            let parser = new Parser(
                'class Fraction(n: Int, d: Int) {\n' +
                    'var num: Int = n\n' +
                    '' +
                    'var den: Int = d\n' +
                    '' +
                    'func gcd(): Int = {\n' +
                    '    let a = num, b = den in {\n' +
                    '        if (b == 0) a else gcd(b, a % b)\n' +
                    '    }\n' +
                    '}\n' +
                    '' +
                    'override func toString(): String = n.toString() + "/" + d.toString()' +
                '}\n' +
                '\n' +
                'class Complex(a: Double, b: Double) {\n' +
                    'var x: Double = a\n' +
                    '' +
                    'var y: Double = b\n' +
                    '' +
                    'override func toString(): String = x.toString() + " + " + b.toString() + "i"' +
                '}\n' +
                '\n' +
                'class Main {\n' +
                    'func doSomething() = "Doing something"\n' +
                '}');

            let program = parser.parseProgram();

            let analyzer = new SemanticAnalyzer(program);

            assert.throws(() => {
                analyzer.runAnalysis()
            }, Error, `Undefined 'main()' method in 'Main' class.`);
        });
    });
});