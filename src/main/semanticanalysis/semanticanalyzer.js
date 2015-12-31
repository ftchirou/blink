import { TypeEnvironment, BuiltInTypes } from './typeenvironment'
import { Class } from '../ast/class'
import { Symbol } from './symbol'
import { SymbolTable } from './symboltable'
import { TypeChecker } from './typechecker'

export class SemanticAnalyzer {

    constructor(program) {
        this.program = program;
        this.initializeEnvironment();
    }

    initializeEnvironment() {
        this.environment = new TypeEnvironment();

        this.environment.addClass(new Class(BuiltInTypes.Object));
        this.environment.addClass(new Class(BuiltInTypes.Int, [], BuiltInTypes.Object));
        this.environment.addClass(new Class(BuiltInTypes.Double, [], BuiltInTypes.Object));
        this.environment.addClass(new Class(BuiltInTypes.Boolean, [], BuiltInTypes.Object));
        this.environment.addClass(new Class(BuiltInTypes.String, [], BuiltInTypes.Object));
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

        let mainClass = this.program.classes.find((klass) => klass.name === 'Main');

        if (mainClass === undefined) {
            throw new Error(`'Main' class not found.`);
        }

        let mainMethod = mainClass.methods.find((method) => method.name === 'main');

        if (mainMethod === undefined) {
            throw new Error(`Undefined 'main()' method in 'Main' class.`);
        }

        if (mainMethod.returnType !== undefined) {
            throw new Error(`'main()' method of 'Main' class should not return a value.`);
        }
    }
}