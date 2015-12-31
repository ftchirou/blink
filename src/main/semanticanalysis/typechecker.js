import { MethodCall } from '../ast/methodcall'
import { Symbol } from './symbol'
import { Types } from '../types/types'

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

            } else if (ast.isThis()) {
                this.typeCheckThis(environment, ast);

            } else if (ast.isUnaryExpression()) {
                this.typeCheckUnaryExpression(environment, ast);

            } else if (ast.isWhile()) {
                this.typeCheckWhile(environment, ast);
            }
        }
    }

    static typeCheckIntegerLiteral(environment, integer) {
        integer.expressionType = Types.Int;
    }

    static typeCheckBooleanLiteral(environment, boolean) {
        boolean.expressionType = Types.Bool;
    }

    static typeCheckDecimalLiteral(environment, decimal) {
        decimal.expressionType = Types.Double;
    }

    static typeCheckStringLiteral(environment, string) {
        string.expressionType = Types.String;
    }

    static typeCheckThis(environment, thisExpr) {
        thisExpr.expressionType = environment.currentClass.name;
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

        expression.expressionType = methodCall.expressionType;
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

    static typeCheckClass(environment, klass) {
        let symbolTable = environment.symbolTable;

        let currentClass = environment.currentClass;

        environment.currentClass = klass;

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

        environment.currentClass = currentClass;
    }

    static typeCheckConstructorCall(environment, call) {
        if (!environment.hasClass(call.type)) {
            throw new Error(this.error(call.line, call.column, `Undefined type '${call.type}'.`));
        }

        let klass = environment.getClass(call.type);

        let parametersCount = klass.parameters.length;

        if (parametersCount !== call.args.length) {
            throw new Error(this.error(call.line, call.column, `Constructor of class '${klass.name}' called with wrong number of arguments.`));
        }

        for (let i = 0; i < parametersCount; ++i) {
            let arg = call.args[i];

            this.typeCheck(environment, arg);

            let argType = arg.expressionType;
            let parameterType = klass.parameters[i].type;

            if (!this.conform(argType, parameterType, environment)) {
                throw new Error(this.error(arg.line, arg.column, `Constructor argument type '${argType}' does not conform to declared type '${parameterType}'.`));
            }
        }

        call.expressionType = call.type;
    }

    static typeCheckIfElse(environment, ifElse) {
        this.typeCheck(environment, ifElse.condition);

        if (ifElse.condition.expressionType !== Types.Bool) {
            throw new Error(this.error(ifElse.condition.line, ifElse.condition.column, `Condition of the if/else expression evaluates to a value of type '${ifElse.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, ifElse.thenBranch);

        if (ifElse.elseBranch === undefined) {
            ifElse.expressionType = Types.Unit;

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

        let symbol = new Symbol(init.identifier, init.type, init.line, init.column);

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

        symbol.type = init.expressionType;

        symbolTable.add(symbol);
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

        if (method.override) {
            let overrided = this.findOverridedMethod(environment.currentClass.superClass, method, environment);

            if (overrided === undefined) {
                throw new Error(this.error(method.line, method.column, `No suitable method '${method.name}' found in superclass(es) to override.`));
            }
        }

        symbolTable.enterScope();

        method.parameters.forEach((parameter) => {
            if (symbolTable.check(parameter.identifier)) {
                throw new Error(this.error(parameter.line, parameter.column, `Duplicate parameter name '${parameter.identifier}' in method '${method.name}'.`));
            }

            symbolTable.add(new Symbol(parameter.identifier, parameter.type, parameter.line, parameter.column));
        });

        this.typeCheck(environment, method.body);

        if (!this.conform(method.body.expressionType, method.returnType, environment)) {
            throw new Error(this.error(method.line, method.column, `Method '${method.name}' value type '${method.body.expressionType}' does not conform to return type '${method.returnType}'.`));
        }

        symbolTable.exitScope();
    }

    static typeCheckMethodCall(environment, call) {
        if (call.object !== undefined) {
            this.typeCheck(environment, call.object);
        }

        let objectClass = call.object === undefined ? environment.currentClass
            : environment.getClass(call.object.expressionType);

        if (!objectClass.hasMethodWithName(call.methodName)) {
            throw new Error(this.error(call.line, call.column, `No method '${call.methodName}' defined in class '${objectClass.name}'.`));
        }

        call.args.forEach((arg) => {
            this.typeCheck(environment, arg);
        });

        let argsTypes = call.args.map((arg) => arg.expressionType);

        let method = this.findMethod(objectClass, call.methodName, argsTypes, environment);

        if (method === undefined) {
            throw new Error(this.error(call.line, call.column, `Method '${call.methodName}' of class '${objectClass.name}' cannot be applied to '(${argsTypes.join(",")})'.`));
        }

        call.expressionType = method.returnType;
    }

    static typeCheckReference(environment, reference) {
        let symbol = environment.symbolTable.find(reference.identifier);

        if (symbol !== undefined) {
            reference.expressionType = symbol.type;

        } else if (environment.currentClass.hasVariable(reference.identifier)) {
            reference.expressionType = environment.currentClass
                .getVariable(reference.identifier)
                .type;

        } else {
            throw new Error(this.error(reference.line, reference.column, `Reference to an undefined identifier '${reference.identifier}'.`));
        }
    }

    static typeCheckUnaryExpression(environment, expression) {
        let methodCall = new MethodCall(undefined, expression.operator, [expression.expression]);

        methodCall.line = expression.line;
        methodCall.column = expression.column;

        this.typeCheckMethodCall(environment, methodCall);

        expression.expressionType = methodCall.expressionType;
    }

    static typeCheckVariable(environment, variable) {
        let symbolTable = environment.symbolTable;

        if (symbolTable.check(variable.name)) {
            throw new Error(this.error(variable.line, variable.column, `An instance variable named '${variable.name}' is already in scope.`));
        }

        if (variable.value !== undefined) {
            this.typeCheck(environment, variable.value);

            if (variable.type === undefined) {
                variable.type = variable.value.expressionType;

            } else {
                if (!this.conform(variable.value.expressionType, variable.type, environment)) {
                    throw new Error(this.error(variable.line, variable.column, `Value of type '${variable.value.expressionType}' cannot be assigned to variable '${variable.name}' of type '${variable.type}'.`));
                }
            }
        }

        symbolTable.add(new Symbol(variable.name, variable.type, variable.line, variable.column));
    }

    static typeCheckWhile(environment, whileExpr) {
        this.typeCheck(environment, whileExpr.condition);

        if (whileExpr.condition.expressionType !== Types.Bool) {
            throw new Error(this.error(whileExpr.condition.line, whileExpr.condition.column, `Condition of a while loop evaluates to a value of type '${whileExpr.condition.expressionType}', must evaluate to a boolean value.`));
        }

        this.typeCheck(environment, whileExpr.body);

        whileExpr.expressionType = Types.Unit;
    }

    static findMethod(klass, name, argsTypes, environment) {
        let methods = klass.methods.filter((method) => method.name === name
        && method.parameters.length === argsTypes.length);

        if (methods.length === 0) {
            return undefined;
        }

        methods = methods.filter((method) => this.allConform(argsTypes, method.parameters.map((param) => param.type), environment));

        if (methods.length == 0) {
            return undefined;
        }

        return methods.reduce((curr, prev) => this.mostSpecificMethod(curr, prev));
    }

    static findOverridedMethod(superClassName, overridingMethod, environment) {
        if (superClassName === undefined) {
            return undefined;
        }

        let klass = environment.getClass(superClassName);

        do {
            let method = klass.methods.find((method) => method.equals(overridingMethod));

            if (method !== undefined) {
                return method;
            }

            if (klass.superClass === undefined) {
                break;
            }

            klass = environment.getClass(superClass.superClass);

        } while (klass.superClass !== undefined);

        return undefined;
    }

    static conform(typeA, typeB, environment) {
        if (typeB === Types.Object || typeA === typeB) {
            return true;
        }

        let classA = environment.getClass(typeA);
        let classB = environment.getClass(typeB);

        do {
            if (classB.name === Types.Object) {
                return false;
            }

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
        if (typeA === typeB) {
            return typeA;
        }

        let classA = environment.getClass(typeA);
        let classB = environment.getClass(typeB);

        if (classA.superClass === classB.superClass) {
            return classA.superClass;
        }

        if (this.inheritanceIndex(typeA, Types.Object, environment) > this.inheritanceIndex(typeB, Types.Object, environment)) {
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