import * as assert from 'assert'
import { Assignment } from '../../main/ast/assignment'
import { BinaryExpression } from '../../main/ast/binaryexpression'
import { Block } from '../../main/ast/block'
import { Initialization } from '../../main/ast/initialization'
import { IntegerLiteral } from '../../main/ast/integer'
import { Reference } from '../../main/ast/reference'
import { SemanticAnalyzer } from '../../main/semanticanalysis/semanticanalyzer'
import { SymbolTable } from '../../main/semanticanalysis/symboltable'

describe('SemanticAnalyzer', () => {

    describe('#buildSymbolTable', () => {

        it('should collect all the symbols in an initialization', () => {
            let analyzer = new SemanticAnalyzer(new Initialization('x', 'Int', new IntegerLiteral('42')));

            let table = analyzer.symbolTable;

            table.enterScope();

            assert.equal('x', table.find('x').identifier);
        });

        it('should create a new scope for a block expression', () => {
            let analyzer = new SemanticAnalyzer(new Block([new Initialization('x', 'Int', new IntegerLiteral('42'))]));

            let table = analyzer.symbolTable;

            assert.equal(2, table.scopesCount());

            table.enterScope();

            assert.equal(false, table.check('x'));

            table.enterScope();

            assert.equal(true, table.check('x'));
        });

        it('should throw an error if a non-declared variable is being assigned', () => {
            assert.throws(() => {
                new SemanticAnalyzer(new Assignment('x', new IntegerLiteral('42')));

            }, Error, "Assignment to a non-declared variable 'x' at 0:0");
        });

        it('should throw an error if a non-declared variable is being referenced', () => {
            assert.throws(() => {
                new SemanticAnalyzer(
                    new BinaryExpression(
                        new Reference('x'),
                        '+',
                        new IntegerLiteral('42')
                    ));
            }, Error, "Reference to a non-declared variable 'x' at 0:0.");
        });
    });
});