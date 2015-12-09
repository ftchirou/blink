import { Environment, BuiltInTypes } from './environment'
import { Symbol } from './symbol'
import { SymbolTable } from './symboltable'
import { TypeChecker } from './typechecker'

export class SemanticAnalyzer {

    constructor(program) {
        this.program = program;
        this.environment = new Environment();
    }

    runAnalysis() {
        this.program.classes.forEach((klass) => {
            if (this.environment.hasClass(klass.name)) {
                throw new Error(`Class '${klass.name}' at ${klass.line + 1}:${klass.column + 1} is already defined.`);
            }

            this.environment.addClass(klass);

            this.environment.currentClass = klass;

            this.environment.symbolTable.enterNamespace(klass.name);

            TypeChecker.typeCheck(this.environment, klass);
        });
    }
}