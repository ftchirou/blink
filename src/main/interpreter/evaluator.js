import { ConstructorCall } from '../ast/constructorcall'
import { Expression } from '../ast/expression'
import { LazyExpression } from '../ast/lazyexpression'
import { MethodCall } from '../ast/methodcall'
import { Obj } from './object'
import { Reference } from '../ast/reference'
import { Report } from '../util/report'
import { Types } from '../types/types'

export class Evaluator {

    constructor() {
    }

    static evaluate(context, expression) {
        if (expression === undefined || expression.isDefinition()) {
            return Obj.create(context, Types.Unit);
        }

        let value = null;

        if (expression.isAssignment()) {
            value = this.evaluateAssignment(context, expression);

        } else if (expression.isBinaryExpression()) {
            value = this.evaluateBinaryExpression(context, expression);

        } else if (expression.isBlock()) {
            value = this.evaluateBlock(context, expression);

        } else if (expression.isBooleanLiteral()) {
            value = this.evaluateBooleanLiteral(context, expression);

        } else if (expression.isCast()) {
            value = this.evaluateCast(context, expression);

        } else if (expression.isConstructorCall()) {
            value = this.evaluateConstructorCall(context, expression);

        } else if (expression.isDecimalLiteral()) {
            value = this.evaluateDecimalLiteral(context, expression);

        } else if (expression.isIfElse()) {
            value = this.evaluateIfElse(context, expression);

        } else if (expression.isInitialization()) {
            value = this.evaluateInitialization(context, expression);

        } else if (expression.isIntegerLiteral()) {
            value = this.evaluateIntegerLiteral(context, expression);

        } else if (expression.isLet()) {
            value = this.evaluateLet(context, expression);

        } else if (expression.isMethodCall()) {
            value = this.evaluateMethodCall(context, expression);

        } else if (expression.isNative()) {
            value = this.evaluateNative(context, expression);

        } else if (expression.isNullLiteral()) {
            value = this.evaluateNullLiteral(context, expression);

        } else if (expression.isReference()) {
            value = this.evaluateReference(context, expression);

        } else if (expression.isStringLiteral()) {
            value = this.evaluateStringLiteral(context, expression);

        } else if (expression.isThis()) {
            value = this.evaluateThis(context, expression);

        } else if (expression.isUnaryExpression()) {
            value = this.evaluateUnaryExpression(context, expression);

        } else if (expression.isWhile()) {
            value = this.evaluateWhile(context, expression);

        }

        expression.expressionType = value.type;

        return value;
    }

    static evaluateAssignment(context, assign) {
        let address = context.environment.find(assign.identifier);

        let value = assign.operator === '='
            ? this.evaluate(context, assign.value)
            : this.evaluateMethodCall(context, new MethodCall(new Reference(assign.identifier), assign.operator.charAt(0), [assign.value]));

        if (address !== undefined) {
            context.store.put(address, value);

        } else if (context.self.has(assign.identifier)) {
            context.self.set(assign.identifier, value);
        }

        return Obj.create(context, Types.Unit);
    }

    static evaluateBinaryExpression(context, expression) {
        return this.evaluateMethodCall(context, new MethodCall(expression.left, expression.operator, [expression.right]));
    }

    static evaluateBlock(context, block) {
        let size = block.expressions.length;

        if (size == 0) {
            return Obj.create(context, Types.Unit);
        }

        context.environment.enterScope();

        for (let i = 0; i < size - 1; ++i) {
            this.evaluate(context, block.expressions[i]);
        }

        let value = this.evaluate(context, block.expressions[size - 1]);

        context.environment.exitScope();

        return value;
    }

    static evaluateBooleanLiteral(context, bool) {
        let value = Obj.create(context, Types.Bool);

        value.set('value', bool.value === 'true');

        return value;
    }

    static evaluateCast(context, cast) {
        let object = this.evaluate(context, cast.object);

        let value = Obj.create(context, cast.type);

        object.properties.forEach((v, k) => {
            value.set(k, v);
        });

        return value;
    }

    static evaluateConstructorCall(context, call) {
        let object = Obj.create(context, call.type);

        let self = context.self;
        context.self = object;

        this.evaluateConstructor(context, object, object.type, call.args);

        context.self = self;

        return object;
    }

    static evaluateConstructor(context, object, type, args) {
        let klass = context.getClass(type);

        let argsValues = args.map((arg) => this.evaluate(context, arg));

        for (let i = 0, l = klass.parameters.length; i < l; ++i) {
            object.set(klass.parameters[i].identifier, argsValues[i]);
        }

        if (klass.superClass !== undefined) {
            this.evaluateConstructor(context, object, klass.superClass, klass.superClassArgs);
        }

        klass.variables.forEach((variable) => {
            object.set(variable.name, this.evaluateVariable(context, variable));
        });
    }

    static evaluateDecimalLiteral(context, decimal) {
        let value = Obj.create(context, Types.Double);

        value.set('value', parseFloat(decimal.value));

        return value;
    }

    static evaluateIfElse(context, ifElse) {
        let condition = this.evaluate(context, ifElse.condition);

        return condition.get('value')
            ? this.evaluate(context, ifElse.thenBranch)
            : this.evaluate(context, ifElse.elseBranch);
    }

    static evaluateInitialization(context, init) {
        let value = init.value !== undefined ? this.evaluate(context, init.value)
                                             : Obj.defaultValue(context, init.type);

        let address = context.store.alloc(value);

        context.environment.add(init.identifier, address);
    }

    static evaluateIntegerLiteral(context, integer) {
        let value = Obj.create(context, Types.Int);

        value.set('value', parseInt(integer.value));

        return value;
    }

    static evaluateLet(context, letExpr) {
        letExpr.initializations.forEach((init) => {
            this.evaluateInitialization(context, init);
        });

        let value = this.evaluate(context, letExpr.body);

        letExpr.initializations.forEach((init) => {
            context.store.free(context.environment.find(init.identifier));
        });

        return value;
    }

    static evaluateMethodCall(context, call) {
        let object = call.object === undefined ? context.self
            : this.evaluate(context, call.object);

        context.environment.enterScope();

        let method = object.getMostSpecificMethod(call.methodName, call.args.map((arg) => arg.expressionType), context);

        if (method === undefined) {
            context.environment.exitScope();

            throw new Error(Report.error(call.line, call.column, `No method '${call.methodName}' defined in class '${object.type}'.`));
        }

        let argsValues = [];

        for (let i = 0, l = method.parameters.length; i < l; ++i) {
            if (method.parameters[i].lazy) {
                argsValues.push(new LazyExpression(call.args[i], context.copy()));

            } else {
                argsValues.push(this.evaluate(context, call.args[i]));
            }
        }

        for (let i = 0, l = method.parameters.length; i < l; ++i) {
            context.environment.add(method.parameters[i].identifier, context.store.alloc(argsValues[i]));
        }

        let self = context.self;

        context.self = object;

        let value = this.evaluate(context, method.body);

        method.parameters.forEach((parameter) => {
            context.store.free(context.environment.find(parameter.identifier));
        });

        context.environment.exitScope();

        context.self = self;

        return value;
    }

    static evaluateNative(context, native) {
        return native.func(context);
    }

    static evaluateNullLiteral(context, nullExpr) {
        return Obj.create(context, Types.Null);
    }

    static evaluateReference(context, reference) {
        let address = context.environment.find(reference.identifier);

        if (address !== undefined) {
            let value = context.store.get(address);

            if (value instanceof Expression) {
                value = this.evaluate(context, value);

                context.store.put(address, value);
            }

            return value;
        }

        let prop = context.self.get(reference.identifier);

        if (prop instanceof Expression) {
            prop = this.evaluate(context, prop);

            context.self.set(reference.identifier, prop);
        }

        return prop;
    }

    static evaluateStringLiteral(context, string) {
        let value = Obj.create(context, Types.String);

        value.set('value', string.value.substring(1, string.value.length - 1));

        return value;
    }

    static evaluateThis(context, thisExpr) {
        return context.self;
    }

    static evaluateUnaryExpression(context, expression) {
        return this.evaluateMethodCall(context, new MethodCall(expression.expression, 'unary_' + expression.operator, []));
    }

    static evaluateVariable(context, variable) {
        if (variable.value === undefined) {
            return Obj.defaultValue(context, variable.type);
        }

        return this.evaluate(context, variable.value);
    }

    static evaluateWhile(context, whileExpr) {
        while (this.evaluate(context, whileExpr.condition).get('value') === true) {
            this.evaluate(context, whileExpr.body);
        }

        return Obj.create(context, Types.Unit);
    }
}