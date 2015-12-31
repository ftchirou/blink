import { ConstructorCall } from '../ast/constructorcall'
import { MethodCall } from '../ast/methodcall'
import { Obj } from './object'
import { Reference } from '../ast/reference'
import { Types } from '../types/types'

export class Evaluator {

    constructor() {
    }

    static evaluate(context, expression) {
        if (expression === undefined) {
            return;
        }

        if (expression.isDefinition()) {
            return;
        }

        if (expression.isAssignment()) {
            return this.evaluateAssignment(context, expression);

        } else if (expression.isBinaryExpression()) {
            return this.evaluateBinaryExpression(context, expression);

        } else if (expression.isBlock()) {
            return this.evaluateBlock(context, expression);

        } else if (expression.isBooleanLiteral()) {
            return this.evaluateBooleanLiteral(context, expression);

        } else if (expression.isConstructorCall()) {
            return this.evaluateConstructorCall(context, expression);

        } else if (expression.isDecimalLiteral()) {
            return this.evaluateDecimalLiteral(context, expression);

        } else if (expression.isIfElse()) {
            return this.evaluateIfElse(context, expression);

        } else if (expression.isInitialization()) {
            return this.evaluateInitialization(context, expression);

        } else if (expression.isIntegerLiteral()) {
            return this.evaluateIntegerLiteral(context, expression);

        } else if (expression.isLet()) {
            return this.evaluateLet(context, expression);

        } else if (expression.isMethodCall()) {
            return this.evaluateMethodCall(context, expression);

        } else if (expression.isNative()) {
            return this.evaluateNative(context, expression);

        } else if (expression.isReference()) {
            return this.evaluateReference(context, expression);

        } else if (expression.isStringLiteral()) {
            return this.evaluateStringLiteral(context, expression);

        } else if (expression.isUnaryExpression()) {
            return this.evaluateUnaryExpression(context, expression);

        } else if (expression.isWhile()) {
            return this.evaluateWhile(context, expression);

        }
    }

    static evaluateAssignment(context, assign) {
        if (assign.operator !== '=') {
            return this.evaluateMethodCall(context, new MethodCall(new Reference(assign.identifier), assign.operator, assign.value));
        }

        let address = context.environment.find(assign.identifier);

        let value = assign.operator === '='
            ? this.evaluate(context, assign.value)
            : this.evaluateMethodCall(context, new MethodCall(new Reference(assign.identifier), assign.operator.charAt(0), assign.value));

        if (address !== undefined) {
            context.store.put(address, value);

        } else if (context.self.has(assign.identifier)) {
            context.self.set(assign.identifier, value);
        }

        return value;
    }

    static evaluateBinaryExpression(context, expression) {
        return this.evaluateMethodCall(context, new MethodCall(expression.left, expression.operator, [expression.right]));
    }

    static evaluateBlock(context, block) {
        let size = block.expressions.length;

        if (size == 0) {
            return new Obj.create(context, Types.Unit);
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

    static evaluateConstructorCall(context, call) {
        let object = Obj.create(context, call.type);

        object.type = call.type;

        let self = context.self;

        context.self = object;

        this.evaluateConstructor(context, object, object.type, call.args);

        context.self = self;

        return object;
    }

    static evaluateConstructor(context, object, type, args) {
        let klass = context.getClass(type);

        if (klass.superClass !== undefined) {
            this.evaluateConstructor(context, object, klass.superClass, klass.superClassArgs);
        }

        for (let i = 0, l = klass.parameters.length; i < l; ++i) {
            object.set(klass.parameters[i].identifier, this.evaluate(context, args[i]));
        }

        klass.variables.forEach((variable) => {
            object.set(variable.name, this.evaluate(context, variable.value));
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
        let value = this.evaluate(context, init.value);

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

        let values = call.args.map((arg) => this.evaluate(context, arg));

        for (let i = 0, l = method.parameters.length; i < l; ++i) {
            context.environment.add(method.parameters[i].identifier, context.store.alloc(values[i]));
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

    static evaluateReference(context, reference) {
        let address = context.environment.find(reference.identifier);

        return address !== undefined ? context.store.get(address) : context.self.get(reference.identifier);
    }

    static evaluateStringLiteral(context, string) {
        let value = Obj.create(context, Types.String);

        value.set('value', string.value.substring(1, string.value.length - 1));

        return value;
    }

    static evaluateUnaryExpression(context, expression) {
        return this.evaluateMethodCall(context, new MethodCall(expression.expression, 'unary_' + expression.operator, []));
    }

    static evaluateWhile(context, whileExpr) {
        while (this.evaluate(context, whileExpr.condition).get('value') === true) {
            this.evaluate(context, whileExpr.body);
        }
    }
}