import { ConstructorCall } from '../ast/constructorcall'
import { FunctionCall } from '../ast/functioncall'
import { Report } from '../util/report'
import { Symbol } from './symbol'
import { Types } from '../types/types'
import { TypesUtils } from '../types/typesutils'

export class TypeChecker {

    constructor() {
    }

    static typeCheck(environment, ast) {
        if (ast === undefined) {
            return;
        }

        if (ast.isDefinition()) {
            if (ast.isClass()) {
                this.typeCheckClass(environment, ast);

            }  else if (ast.isFunction()) {
                this.typeCheckFunction(environment, ast);

            } else if (ast.isProperty()) {
                this.typeCheckProperty(environment, ast);
            }

        } else if (ast.isExpression()) {
            if (ast.isAssignment()) {
                this.typeCheckAssignment(environment, ast);

            } else if (ast.isBinaryExpression()) {
                this.typeCheckBinaryExpression(environment, ast);

            } else if (ast.isBlock()) {
                this.typeCheckBlock(environment, ast);

            } else if (ast.isBooleanLiteral()) {
                this.typeCheckBooleanLiteral(environment, ast);

            } else if (ast.isCast()) {
                this.typeCheckCast(environment, ast);

            } else if (ast.isConstructorCall()) {
                this.typeCheckConstructorCall(environment, ast);

            }else if (ast.isDecimalLiteral()) {
                this.typeCheckDecimalLiteral(environment, ast);

            } else if (ast.isIfElse()) {
                this.typeCheckIfElse(environment, ast);

            } else if (ast.isInitialization()) {
                this.typeCheckInitialization(environment, ast);

            } else if (ast.isIntegerLiteral()) {
                this.typeCheckIntegerLiteral(environment, ast);

            } else if (ast.isLet()) {
                this.typeCheckLet(environment, ast);

            } else if (ast.isFunctionCall()) {
                this.typeCheckFunctionCall(environment, ast);

            } else if (ast.isNullLiteral()) {
                this.typeCheckNullLiteral(environment, ast);

            } else if (ast.isReference()) {
                this.typeCheckReference(environment, ast);

            } else if (ast.isStringLiteral()) {
                this.typeCheckStringLiteral(environment, ast);

            } else if (ast.isSuper()) {
                this.typeCheckSuperFunctionCall(environment, ast);

            } else if (ast.isThis()) {
                this.typeCheckThis(environment, ast);

            } else if (ast.isUnaryExpression()) {
                this.typeCheckUnaryExpression(environment, ast);

            } else if (ast.isWhile()) {
                this.typeCheckWhile(environment, ast);
            }
        }
    }

    static typeCheckAssignment(environment, assign) {
        let symbol = environment.symbolTable.find(assign.identifier);

        if (symbol === undefined) {
            throw new Error(Report.error(assign.line, assign.column, `Assignment to an undefined variable '${assign.identifier}'.`));
        }

        this.typeCheck(environment, assign.value);

        let valueType = assign.value.expressionType;

        if (symbol.type === undefined) {
            symbol.type = valueType;

        } else if (!TypesUtils.conform(valueType, symbol.type, environment)) {
            throw new Error(`Value assigned to '${symbol.identifier}' does not conform to the declared type '${symbol.type}'.`);
        }

        assign.expressionType = Types.Unit;
    }

    static typeCheckBinaryExpression(environment, expression) {
        let functionCall = new FunctionCall(expression.left, expression.operator, [expression.right]);

        functionCall.line = expression.line;
        functionCall.column = expression.column;

        this.typeCheckFunctionCall(environment, functionCall);

        expression.expressionType = functionCall.expressionType;
    }

    static typeCheckBlock(environment, block) {
        environment.symbolTable.enterScope();

        block.expressions.forEach((expression) => {
            this.typeCheck(environment, expression);
        });

        let length = block.expressions.length;

        block.expressionType = length > 0 ? block.expressions[length - 1].expressionType : Types.Unit;

        environment.symbolTable.exitScope();
    }

    static typeCheckBooleanLiteral(environment, boolean) {
        boolean.expressionType = Types.Bool;
    }

    static typeCheckCast(environment, cast) {
        this.typeCheck(environment, cast.object);

        if (!TypesUtils.conform(cast.type, cast.object.expressionType, environment)) {
            throw new Error(Report.error(cast.line, cast.column, `Cannot cast an object of type '${cast.object.expressionType}' to '${cast.type}'.`));
        }

        cast.expressionType = cast.type;
    }

    static typeCheckClass(environment, klass) {
        let symbolTable = environment.symbolTable;

        let currentClass = environment.currentClass;

        environment.currentClass = klass;

        symbolTable.enterScope();

        klass.parameters.forEach((parameter) => {
            if (symbolTable.check(parameter.identifier)) {
                throw new Error(Report.error(parameter.line, parameter.column, `Duplicate class parameter name '${parameter.identifier}' in class '${klass.name}' definition.`));
            }

            symbolTable.add(new Symbol(parameter.identifier, parameter.type, parameter.line, parameter.column));
        });

        if (klass.superClass !== undefined) {
            this.typeCheckConstructorCall(environment, new ConstructorCall(klass.superClass, klass.superClassArgs));
        }

        klass.properties.forEach((property) => {
            this.typeCheckProperty(environment, property);
        });

        klass.functions.forEach((func) => {
            if (environment.hasFunction(klass.name, func)) {
                throw new Error(Report.error(func.line, func.column, `Function '${func.name}' with signature '${func.signature()}' is already defined in class '${klass.name}'.`));
            }

            environment.addFunction(klass.name, func);

            this.typeCheckFunction(environment, func);
        });

        symbolTable.exitScope();

        environment.currentClass = currentClass;
    }

    static typeCheckConstructorCall(environment, call) {
        if (!environment.hasClass(call.type)) {
            throw new Error(Report.error(call.line, call.column, `Undefined type '${call.type}'.`));
        }

        let klass = environment.getClass(call.type);

        let parametersCount = klass.parameters.length;

        if (parametersCount !== call.args.length) {
            throw new Error(Report.error(call.line, call.column, `Class '${klass.name}' constructor called with wrong number of arguments.`));
        }

        for (let i = 0; i < parametersCount; ++i) {
            let arg = call.args[i];

            this.typeCheck(environment, arg);

            let argType = arg.expressionType;
            let parameterType = klass.parameters[i].type;

            if (!TypesUtils.conform(argType, parameterType, environment)) {
                throw new Error(Report.error(arg.line, arg.column, `Class '${klass.name}' constructor argument type '${argType}' does not conform to declared type '${parameterType}'.`));
            }
        }

        call.expressionType = call.type;
    }

    static typeCheckDecimalLiteral(environment, decimal) {
        decimal.expressionType = Types.Double;
    }

    static typeCheckFunction(environment, func) {
        let symbolTable = environment.symbolTable;

        if (func.override) {
            let overrided = TypesUtils.findOverridedFunction(environment.currentClass.superClass, func, environment);

            if (overrided === undefined) {
                throw new Error(Report.error(func.line, func.column, `No suitable function '${func.signature()}' found in superclass(es) to override.`));
            }
        }

        symbolTable.enterScope();

        func.parameters.forEach((parameter) => {
            if (symbolTable.check(parameter.identifier)) {
                throw new Error(Report.error(parameter.line, parameter.column, `Duplicate parameter name '${parameter.identifier}' in func '${func.name}'.`));
            }

            symbolTable.add(new Symbol(parameter.identifier, parameter.type, parameter.line, parameter.column));
        });

        this.typeCheck(environment, func.body);

        if (!TypesUtils.conform(func.body.expressionType, func.returnType, environment)) {
            throw new Error(Report.error(func.line, func.column, `Function '${func.name}' value type '${func.body.expressionType}' does not conform to return type '${func.returnType}'.`));
        }

        symbolTable.exitScope();
    }

    static typeCheckFunctionCall(environment, call) {
        if (call.object !== undefined) {
            this.typeCheck(environment, call.object);
        }

        let objectClass = call.object === undefined ? environment.currentClass
            : environment.getClass(call.object.expressionType);

        if (!TypesUtils.hasFunctionWithName(objectClass, call.functionName, environment)) {
            throw new Error(Report.error(call.line, call.column, `No function '${call.functionName}' defined in class '${objectClass.name}'.`));
        }

        call.args.forEach((arg) => {
            this.typeCheck(environment, arg);
        });

        let argsTypes = call.args.map((arg) => arg.expressionType);

        let func = TypesUtils.findMethodToApply(objectClass, call.functionName, argsTypes, environment);

        if (func === undefined) {
            throw new Error(Report.error(call.line, call.column, `Function '${call.functionName}' of class '${objectClass.name}' cannot be applied to '(${argsTypes.join(",")})'.`));
        }

        if (func.isPrivate && !(call.object === undefined ||call.object.isThis())) {
            throw new Error(Report.error(call.line, call.column, `Function '${call.functionName}' of class '${objectClass.name}' is private.`));
        }

        call.expressionType = func.returnType;
    }

    static typeCheckIfElse(environment, ifElse) {
        this.typeCheck(environment, ifElse.condition);

        if (ifElse.condition.expressionType !== Types.Bool) {
            throw new Error(Report.error(ifElse.condition.line, ifElse.condition.column, `Condition of the if/else expression evaluates to a value of type '${ifElse.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, ifElse.thenBranch);

        if (ifElse.elseBranch === undefined) {
            ifElse.expressionType = Types.Unit;

        } else {
            this.typeCheck(environment, ifElse.elseBranch);

            ifElse.expressionType = TypesUtils.leastUpperBound(ifElse.thenBranch.expressionType, ifElse.elseBranch.expressionType, environment);
        }
    }

    static typeCheckInitialization(environment, init) {
        let symbolTable = environment.symbolTable;

        if (symbolTable.check(init.identifier)) {
            throw new Error(Report.error(init.line, init.column, `Duplicate identifier '${init.identifier}' in let binding.`));
        }

        let symbol = new Symbol(init.identifier, init.type, init.line, init.column);

        if (init.value === undefined) {
            init.expressionType = init.type;

        } else {
            this.typeCheck(environment, init.value);

            let valueType = init.value.expressionType;

            if (init.type === undefined) {
                init.type = valueType;

            } else {
                if (!TypesUtils.conform(valueType, init.type, environment)) {
                    throw new Error(Report.error(init.line, init.column, `Assigned value to variable '${init.identifier}' of type '${valueType}' does not conform to its declared type '${init.type}'.`));
                }
            }

            init.expressionType = valueType;
        }

        symbol.type = init.expressionType;

        symbolTable.add(symbol);
    }

    static typeCheckIntegerLiteral(environment, integer) {
        integer.expressionType = Types.Int;
    }

    static typeCheckLet(environment, letExpr) {
        environment.symbolTable.enterScope();

        letExpr.initializations.forEach((init) => {
            this.typeCheckInitialization(environment, init);
        });

        this.typeCheck(environment, letExpr.body);

        letExpr.expressionType = letExpr.body.expressionType;

        environment.symbolTable.exitScope();
    }

    static typeCheckNullLiteral(environment, nullExpr) {
        nullExpr.expressionType = Types.Null;
    }

    static typeCheckProgram(environment, program) {
        let currentClass = environment.currentClass;

        program.classes.forEach((klass) => {
            if (environment.hasClass(klass.name)) {
                throw new Error(`Class '${klass.name}' at ${klass.line + 1}:${klass.column + 1} is already defined.`);
            }

            environment.addClass(klass);
        });

        program.classes.forEach((klass) => {
            environment.currentClass = klass;

            TypeChecker.typeCheck(environment, klass);
        });

        environment.currentClass = currentClass;
    }

    static typeCheckProperty(environment, property) {
        let symbolTable = environment.symbolTable;

        if (symbolTable.check(property.name)) {
            throw new Error(Report.error(property.line, property.column, `An instance variable named '${property.name}' is already in scope.`));
        }

        if (property.value !== undefined) {
            this.typeCheck(environment, property.value);

            if (property.type === undefined) {
                property.type = property.value.expressionType;

            } else {
                if (!TypesUtils.conform(property.value.expressionType, property.type, environment)) {
                    throw new Error(Report.error(property.line, property.column, `Value of type '${property.value.expressionType}' cannot be assigned to variable '${property.name}' of type '${property.type}'.`));
                }
            }
        }

        symbolTable.add(new Symbol(property.name, property.type, property.line, property.column));
    }

    static typeCheckReference(environment, reference) {
        let symbol = environment.symbolTable.find(reference.identifier);

        if (symbol !== undefined) {
            reference.expressionType = symbol.type;

        } else if (environment.currentClass.hasProperty(reference.identifier)) {
            reference.expressionType = environment.currentClass
                .getProperty(reference.identifier)
                .type;

        } else {
            throw new Error(Report.error(reference.line, reference.column, `Reference to an undefined identifier '${reference.identifier}'.`));
        }
    }

    static typeCheckStringLiteral(environment, string) {
        string.expressionType = Types.String;
    }

    static typeCheckSuperFunctionCall(environment, superCall) {
        let currentClass = environment.currentClass;
        environment.currentClass = environment.getClass(currentClass.superClass);

        let call = new FunctionCall(undefined, superCall.functionName, superCall.args);
        call.line = superCall.line;
        call.column = superCall.column;

        this.typeCheckFunctionCall(environment, call);

        superCall.expressionType = call.expressionType;

        environment.currentClass = currentClass;
    }

    static typeCheckThis(environment, thisExpr) {
        thisExpr.expressionType = environment.currentClass.name;
    }

    static typeCheckUnaryExpression(environment, expression) {
        let funcCall = new FunctionCall(expression.expression, 'unary_' + expression.operator, []);

        funcCall.line = expression.line;
        funcCall.column = expression.column;

        this.typeCheckFunctionCall(environment, funcCall);

        expression.expressionType = funcCall.expressionType;
    }

    static typeCheckWhile(environment, whileExpr) {
        this.typeCheck(environment, whileExpr.condition);

        if (whileExpr.condition.expressionType !== Types.Bool) {
            throw new Error(Report.error(whileExpr.condition.line, whileExpr.condition.column, `Condition of a while loop evaluates to a value of type '${whileExpr.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, whileExpr.body);

        whileExpr.expressionType = Types.Unit;
    }
}
