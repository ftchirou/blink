import { BuiltIns } from './types'
import { Symbol } from './symbol'
import { SymbolTable } from './symboltable'
import { Types } from './types'

export class SemanticAnalyzer {

    constructor(ast) {
        this.ast = ast;
        this.types = new Types();
        this.symbolTable = new SymbolTable();

        this.collectTypes(this.ast);

        this.buildSymbolTable(this.ast);
    }

    collectTypes(ast) {
        this.collectDeclaredTypes(ast);
    }

    buildSymbolTable(ast) {
        this.symbolTable.enterScope();

        this.collectSymbols(ast);

        this.symbolTable.exitScope();
    }

    collectDeclaredTypes(node) {
        if (node.isDefinition() && node.isClass()) {
            this.types.add(node.name, node);
        }
    }

    typeCheck(node) {
        if (!node.isExpression() || node.hasType()) {
            return;
        }

        if (node.isIntegerLiteral()) {
            node.expressionType = BuiltIns.Int;

        } else if (node.isBooleanLiteral()) {
            node.expressionType = BuiltIns.Boolean;

        } else if (node.isDecimalLiteral()) {
            node.expressionType = BuiltIns.Double;

        } else if (node.isStringLiteral()) {
            node.expressionType = BuiltIns.String;

        } else if (node.isAssignment()) {
            this.typeCheck(node.value);

            let valueType = node.value.expressionType;

            let symbol = this.symbolTable.find(node.identifier);

            if (symbol.type === undefined) {
                symbol.type = valueType;

            } else if (!this.types.conform(valueType, symbol.type)) {
                throw new Error(`The value assigned to '${symbol.identifier}' does not match the declared type '${symbol.type}'.`);
            }

        } else if (node.isBinaryExpression()) {
            this.typeCheck(node.left);
            this.typeCheck(node.right);
        }
    }

    typeCheckMethodCall(call) {
        if (!call.object.hasType()) {
            this.typeCheck(call.object);
        }
    }

    collectSymbols(node) {
       if (node.isAssignment()) {
           if (this.symbolTable.find(node.identifier) === undefined) {
               throw new Error(`Assignment to a non-declared variable '${node.identifier}' at ${node.line + 1}:${node.column + 1}`);
           }

       } else if (node.isBinaryExpression()) {
           this.collectSymbols(node.left);
           this.collectSymbols(node.right);

       } else if (node.isBlock()) {
           this.symbolTable.enterScope();

           node.expressions.forEach((child) => this.collectSymbols(child, this.symbolTable));

           this.symbolTable.exitScope();

       } else if (node.isConstructorCall()) {
           node.args.forEach((arg) => this.collectSymbols(arg, this.symbolTable));

       } else if (node.isIfElse()) {
           this.collectSymbols(node.condition);
           this.collectSymbols(node.thenBranch);
           this.collectSymbols(node.elseBranch);

       } else if (node.isInitialization()) {
           this.symbolTable.add(new Symbol(node.identifier, node.type));

       } else if (node.isLet()) {
           node.initializations.forEach((initialization) => this.collectSymbols(initialization, this.symbolTable));

       } else if (node.isMethodCall()) {
           this.collectSymbols(node.object);

           node.args.forEach((arg) => this.collectSymbols(arg, this.symbolTable));

       } else if (node.isReference()) {
           if (this.symbolTable.find(node.identifier) === undefined) {
               throw new Error(`Reference to a non-declared variable '${node.identifier}' at ${node.line + 1}:${node.column + 1}.`);
           }

       } else if (node.isUnaryExpression()) {
           this.collectSymbols(node.expression);
       }
    }

}