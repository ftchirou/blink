import { Symbol } from './symbol'
import { SymbolTable } from './symboltable'

export class SemanticAnalyzer {

    buildSymbolTable(ast) {
        var table = new SymbolTable();

        table.enterScope();

        this.collectSymbols(ast, table);

        table.exitScope();

        return table;
    }

    typeCheck(ast) {

    }

    inferTypes(ast) {

    }

    collectSymbols(node, table) {
       if (node.isAssignment()) {
           if (table.find(node.identifier) === undefined) {
               throw new Error(`Assignment to a non-declared variable '${node.identifier} at ${node.line + 1}:${node.column + 1}`);
           }

       } else if (node.isBinaryExpression()) {
           this.collectSymbols(node.left);
           this.collectSymbols(node.right);

       } else if (node.isBlock()) {
           table.enterScope();

           node.expressions.forEach((child) => this.collectSymbols(child, table));

           table.exitScope();

       } else if (node.isConstructorCall()) {
           node.args.forEach((arg) => this.collectSymbols(arg, table));

       } else if (node.isIfElse()) {
           this.collectSymbols(node.condition);
           this.collectSymbols(node.thenBranch);
           this.collectSymbols(node.elseBranch);

       } else if (node.isInitialization()) {
           table.add(new Symbol(node.identifier, node.type));

       } else if (node.isLet()) {
           node.initializations.forEach((initialization) => this.collectSymbols(initialization, table));

       } else if (node.isMethodCall()) {
           this.collectSymbols(node.object);

           node.args.forEach((arg) => this.collectSymbols(arg, table));

       } else if (node.isReference()) {
           if (table.find(node.identifier) === undefined) {
               throw new Error(`Reference to a non-declared variable '${node.identifier}' at ${node.line + 1}:${node.column + 1}.`);
           }

       } else if (node.isUnaryExpression()) {
           this.collectSymbols(node.expression);
       }

    }

}