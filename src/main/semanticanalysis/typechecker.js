import { BuiltInTypes } from './environment'
import { MethodCall } from '../ast/methodcall'
import { Symbol } from './symbol'

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

            } else if (ast.isVariable()) {
                this.typeCheckVariable(environment, ast);

            } else if (ast.isMethod()) {
                this.typeCheckMethod(environment, ast);
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

            } else if (ast.isConstructorCall()) {
                this.typeCheckConstructorCall(environment, ast);

            } else if (ast.isDecimalLiteral()) {
                this.typeCheckDecimalLiteral(environment, ast);

            } else if (ast.isIfElse()) {
                this.typeCheckIfElse(environment, ast);

            } else if (ast.isInitialization()) {
                this.typeCheckInitialization(environment, ast);

            } else if (ast.isIntegerLiteral()) {
                this.typeCheckIntegerLiteral(environment, ast);

            } else if (ast.isLet()) {
                this.typeCheckLet(environment, ast);

            } else if (ast.isMethodCall()) {
                this.typeCheckMethodCall(environment, ast);

            } else if (ast.isReference()) {
                this.typeCheckReference(environment, ast);

            } else if (ast.isStringLiteral()) {
                this.typeCheckStringLiteral(environment, ast);

            } else if (ast.isUnaryExpression()) {
                this.typeCheckUnaryExpression(environment, ast);

            } else if (ast.isWhile()) {
                this.typeCheckWhile(environment, ast);
            }
        }
    }

    static typeCheckIntegerLiteral(environment, integer) {
        integer.expressionType = BuiltInTypes.Int;
    }

    static typeCheckBooleanLiteral(environment, boolean) {
        boolean.expressionType = BuiltInTypes.Boolean;
    }

    static typeCheckDecimalLiteral(environment, decimal) {
        decimal.expressionType = BuiltInTypes.Double;
    }

    static typeCheckStringLiteral(environment, string) {
        string.expressionType = BuiltInTypes.String;
    }

    static typeCheckAssignment(environment, assign) {
        let symbol = environment.symbolTable.find(assign.identifier);

        if (symbol === undefined) {
            throw new Error(this.error(assign.line, assign.column, `Assignment to an undefined variable '${assign.identifier}'.`));
        }

        this.typeCheck(environment, assign.value);

        let valueType = assign.value.expressionType;

        if (symbol.type === undefined) {
            symbol.type = valueType;

        } else if (!this.conform(valueType, symbol.type, environment)) {
            throw new Error(`Value assigned to '${symbol.identifier}' does not conform to the declared type '${symbol.type}'.`);
        }
    }

    static typeCheckBinaryExpression(environment, expression) {
        let methodCall = new MethodCall(expression.left, expression.operator, [expression.right]);

        methodCall.line = expression.line;
        methodCall.column = expression.column;

        this.typeCheckMethodCall(environment, methodCall);
    }

    static typeCheckBlock(environment, block) {
        environment.symbolTable.enterScope();

        block.expressions.forEach((expression) => {
            this.typeCheck(environment, expression);
        });

        environment.symbolTable.exitScope();
    }

    static typeCheckClass(environment, klass) {
        let symbolTable = environment.symbolTable;

        symbolTable.enterScope();

        klass.parameters.forEach((parameter) => {
            if (symbolTable.check(parameter.identifier)) {
                throw new Error(this.error(parameter.line, parameter.column, `Duplicate class parameter name '${parameter.identifier}' in class '${klass.name}' definition.`));
            }

            symbolTable.add(new Symbol(parameter.identifier, parameter.type, parameter.line, parameter.column));
        });

        klass.variables.forEach((variable) => {
            this.typeCheckVariable(environment, variable);
        });

        klass.methods.forEach((method) => {
            if (environment.hasMethod(klass.name, method)) {
                throw new Error(this.error(method.line, method.column, `Method '${method.name}' with signature '${method.signature()}' is already defined in class '${klass.name}'.`));
            }

            environment.addMethod(klass.name, method);

            this.typeCheckMethod(environment, method);
        });

        symbolTable.exitScope();
    }

    static typeCheckConstructorCall(environment, call) {
        if (!environment.hasClass(call.type)) {
            throw new Error(`Undefined type '${call.type}' at ${call.line + 1}:${call.column + 1}.`);
        }

        let klass = environment.getClass(call.type);

        let parametersCount = klass.parameters.length;

        if (parametersCount !== call.args.length) {
            throw new Error(`Constructor of class '${klass.name}' called with wrong number of arguments at ${call.line + 1}:${call.column + 1}.`);
        }

        for (let i = 0; i < parametersCount; ++i) {
            let arg = call.args[i];

            this.typeCheck(arg);

            let argType = arg.expressionType;
            let parameterType = klass.parameters[i].type;

            if (!this.conform(argType, parameterType, environment)) {
                throw new Error(`Constructor argument type (${argType}) at ${arg.line + 1}:${arg.column + 1} does not conform to declared type '${parameterType}'.`);
            }
        }

        call.expressionType = call.type;
    }

    static typeCheckIfElse(environment, ifElse) {
        this.typeCheck(environment, ifElse.condition);

        if (ifElse.condition.expressionType !== BuiltInTypes.Boolean) {
            throw new Error(this.error(ifElse.condition.line, ifElse.condition.column, `Condition of the if/else expression evaluates to a value of type '${ifElse.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, ifElse.thenBranch);

        if (ifElse.elseBranch === undefined) {
            ifElse.expressionType = BuiltInTypes.Unit;

        } else {
            this.typeCheck(environment, ifElse.elseBranch);

            ifElse.expressionType = this.leastUpperBound(ifElse.thenBranch.expressionType, ifElse.elseBranch.expressionType, environment);
        }
    }

    static typeCheckInitialization(environment, init) {
        let symbolTable = environment.symbolTable;

        if (symbolTable.check(init.identifier)) {
            throw new Error(this.error(init.line, init.column, `Duplicate identifier '${init.identifier}' in let binding.`));
        }

        symbolTable.add(new Symbol(init.identifier, init.type, init.line, init.column));

        if (init.value === undefined) {
            init.expressionType = init.type;

        } else {
            this.typeCheck(environment, init.value);

            let valueType = init.value.expressionType;

            if (init.type === undefined) {
                init.type = valueType;

            } else {
                if (!this.conform(valueType, init.type, environment)) {
                    throw new Error(this.error(init.line, init.column, `Assigned value to variable '${init.identifier}' of type '${valueType}'does not conform to its declared type '${init.type}'.`));
                }
            }

            init.expressionType = valueType;
        }
    }

    static typeCheckLet(environment, letExpr) {
        environment.symbolTable.enterScope();

        letExpr.initializations.forEach((init) => {
            this.typeCheckInitialization(environment, init);
        });

        this.typeCheck(environment, letExpr.body);

        environment.symbolTable.exitScope();
    }

    static typeCheckMethod(environment, method) {
        let symbolTable = environment.symbolTable;

        symbolTable.enterScope();

        method.parameters.forEach((parameter) => {
            if (symbolTable.check(parameter.identifier)) {
                throw new Error(this.error(parameter.line, parameter.column, `Duplicate parameter name '${parameter.identifier}' in method '${method.name}'.`));
            }

            symbolTable.add(new Symbol(parameter.identifier, parameter.type, parameter.line, parameter.column));
        });

        this.typeCheck(method.body);

        symbolTable.exitScope();
    }

    static typeCheckMethodCall(environment, call) {
        if (call.object !== undefined) {
            this.typeCheck(environment, call.object);
        }

        let objectClass = call.object === undefined ? environment.currentClass
            : environment.getClass(call.object.expressionType);

        if (!objectClass.hasMethodWithName(call.methodName)) {
            throw new Error(this.error(call.line, call.column, `No method with name '${call.methodName}' defined in class '${objectClass.name}'.`));
        }

        call.args.forEach((arg) => {
            this.typeCheck(environment, arg);
        });

        let argsTypes = call.args.map((arg) => arg.type);

        let method = this.findMethod(name, argsTypes);

        if (method === undefined) {
            throw new Error(this.error(call.line, call.column, `No suitable overloaded method '${call.methodName}' found for parameters '(${argsTypes.join(",")})'.`));
        }

        call.expressionType = method.returnType;
    }

    static typeCheckReference(environment, reference) {
        let symbol = environment.symbolTable.find(reference.identifier);

        if (symbol === undefined) {
            throw new Error(this.error(reference.line, reference.column, `Reference to an undefined identifier '${reference.identifier}'.`));
        }

        reference.expressionType = symbol.type;
    }

    static typeCheckUnaryExpression(environment, expression) {
        let methodCall = new MethodCall(undefined, expression.operator, [expression.expression]);

        methodCall.line = expression.line;
        methodCall.column = expression.column;

        this.typeCheckMethodCall(environment, methodCall);
    }

    static typeCheckVariable(environment, variable) {
        let symbolTable = environment.symbolTable;

        if (symbolTable.check(variable.name)) {
            throw new Error(this.error(variable.line, variable.column, `An instance variable named '${variable.name}' is already in scope.`));
        }

        symbolTable.add(new Symbol(variable.name, variable.type, variable.line, variable.column));

        if (variable.value !== undefined) {
            this.typeCheck(environment, variable.value);

            if (!this.conform(variable.value.expressionType, variable.type, environment)) {
                throw new Error(this.error(variable.line, variable.column, `Value of type '${variable.value.expressionType}' cannot be assigned to variable '${variable.identifier}' of type '${variable.type}'.`));
            }
        }
    }

    static typeCheckWhile(environment, whileExpr) {
        this.typeCheck(environment, whileExpr.condition);

        if (whileExpr.condition.expressionType !== BuiltInTypes.Boolean) {
            throw new Error(this.error(whileExpr.condition.line, whileExpr.condition.column, `Condition of a while loop evaluates to a value of type '${whileExpr.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, whileExpr.body);

        whileExpr.expressionType = BuiltInTypes.Unit;
    }

    static findMethod(klass, name, argsTypes) {
        let methods = klass.methods.filter((method) => method.name === name
        && method.parameters.length === argsTypes.length);

        if (methods.length === 0) {
            return undefined;
        }

        return methods.filter((method) => this.allConform(argsTypes, method.parameters.map((param) => param.type)))
                      .reduce((curr, prev) => this.mostSpecificMethod(curr, prev));
    }

    static conform(typeA, typeB, environment) {
        let classA = environment.getClass(typeA);
        let classB = environment.getClass(typeB);

        do {
            if (classA.superClass === classB.name) {
                return true;
            }

            if (classB.superClass === undefined) {
                return false;
            }

            classB = environment.getClass(classB.superClass);

        } while (classB !== undefined);

        return false;
    }

    static leastUpperBound(typeA, typeB, environment) {
        if (typeA === BuiltInTypes.Object || typeB === BuiltInTypes.Object) {
            return BuiltInTypes.Object;
        }

        let classA = environment.getClass(typeA);
        let classB = environment.getClass(typeB);

        if (classA.superClass === classB.superClass) {
            return classA.superClass;
        }

        if (this.inheritanceIndex(typeA, BuiltInTypes.Object, environment) > this.inheritanceIndex(typeB, BuiltInTypes.Object, environment)) {
            return this.leastUpperBound(classA.superClass, typeB, environment);
        }

        return this.leastUpperBound(typeA, classB.superClass, environment);
    }

    static allConform(typesA, typesB, environment) {
        for (let i = 0, length = typesA.length; i < length; ++i) {
            if (!this.conform(typesA[i], typesB[i], environment)) {
                return false;
            }
        }

        return true;
    }

    static mostSpecificMethod(methodA, methodB) {
        if (methodA === undefined || methodB === undefined) {
            return undefined;
        }

        let paramsTypesA = methodA.parameters.map((param) => param.type);
        let paramsTypesB = methodB.parameters.map((param) => param.type);

        if (this.allConform(paramsTypesA, paramsTypesB)) {
            return methodA;

        } else if (this.allConform(paramsTypesB, paramsTypesA)) {
            return methodB;
        }

        return undefined;
    }

    static inheritanceIndex(typeA, typeB, environment) {
        let index = 0;

        while (typeA !== undefined && typeA !== typeB) {
            index++;

            typeA = environment.getClass(typeA).superClass;
        }

        return index;
    }

    static error(line, column, message) {
        if (line === undefined || column === undefined) {
            return message;
        }

        return `${line + 1}:${column + 1}: ${message}`;
    }
}