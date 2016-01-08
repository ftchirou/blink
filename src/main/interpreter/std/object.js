import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { MethodCall } from '../../ast/methodcall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Reference } from '../../ast/reference'
import { This } from '../../ast/this'
import { TypeChecker } from '../../semanticanalysis/typechecker'
import { Types } from '../../types/types'

export class ObjectClass extends Class {

    constructor() {
        super();

        this.name = Types.Object;

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', context.self.type + '@' + context.self.address);

                return value;
            })));

        this.methods.push(new Method('==', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));

                let value = Obj.create(context, Types.Bool);

                if (context.self.type !== rhs.type) {
                    value.set('value', false);
                } else {
                    value.set('value', context.self.address === rhs.address);
                }

                return value;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));

                let object = new This();
                object.expressionType = Types.Object;

                let arg = new Reference('rhs');
                arg.expressionType = Types.Object;

                let call = new MethodCall(object, '==', [arg]);

                let value = Evaluator.evaluate(context, call);

                value.set('value', !value.get('value'));

                return value;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.Null)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.self.type !== Types.Null);

                return value;
            })));

        this.methods.push(new Method('+', [new Formal('rhs', Types.String)], Types.String,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));

                let object = new This();
                object.expressionType = Types.Object;

                let call = new MethodCall(object, 'toString', []);

                let self = Evaluator.evaluate(context, call);

                let value = Obj.create(context, Types.String);

                value.set('value', self.get('value') + rhs.get('value'));

                return value;
            })));
    }
}