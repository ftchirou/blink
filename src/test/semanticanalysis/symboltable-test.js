import * as assert from 'assert'
import { Symbol } from '../../main/semanticanalysis/symbol'
import { SymbolTable } from '../../main/semanticanalysis/symboltable'

describe('SymbolTable', () => {

    describe('#check', () => {

        it('should return true if the identifier is declared in the current scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            assert.equal(true, table.check('x'));
        });

        it('should return false if the identifier is not declared in the current scope but in an enclosing scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            table.enterScope();

            assert.equal(false, table.check('x'));
        });

        it('should return false if the identifier is not declared at all', () => {
            let table = new SymbolTable();

            table.enterScope();

            assert.equal(false, table.check('x'));
        });
    });

    describe('#find', () => {

        it('should return the identifier declared in the most closest scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            table.enterScope();

            table.add(new Symbol('x', 'String'));

            let symbol = table.find('x');

            assert.equal('x', symbol.identifier);
            assert.equal('String', symbol.type);
        });

        it('should return the identifier declared in the enclosing scope if the identifier is not available in the current scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            table.enterScope();

            let symbol = table.find('x');

            assert.equal('x', symbol.identifier);
            assert.equal('Int', symbol.type);
        });

        it('should return undefined for an identifier that has not been declared', () => {
            let table = new SymbolTable();

            table.enterScope();

            let symbol = table.find('x');

            assert.equal(undefined, symbol);
        });
    });

    describe('#enterScope', () => {

        it('should create a new nested scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            table.enterScope();

            assert.equal(false, table.check('x'));
        });

        it('should enter the next enclosed scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            assert.equal(true, table.check('x'));

            table.exitScope();

            assert.equal(false, table.check('x'));

            table.enterScope();

            assert.equal(true, table.check('x'));
        });
    });

    describe('#exitScope', () => {

        it('should go back to the enclosing scope', () => {
            let table = new SymbolTable();

            table.enterScope();

            table.add(new Symbol('x', 'Int'));

            table.enterScope();

            assert.equal(false, table.check('x'));

            table.exitScope();

            assert.equal(true, table.check('x'));
        });
    });

});