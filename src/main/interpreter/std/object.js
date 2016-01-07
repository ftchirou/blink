import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { MethodCall } from '../../ast/methodcall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { This } from '../../ast/this'
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

                let value = Obj.create(context, Types.Bool);

                if (context.self.type !== rhs.type) {
                    value.set('value', true);
                } else {
                    value.set('value', context.self.address !== rhs.address);
                }

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

                let call = new MethodCall(new This(), 'toString', []);
                let self = Evaluator.evaluate(context, call);

                let value = Obj.create(context, Types.String);

                value.set('value', self.get('value') + rhs.get('value'));

                return value;
            })));
    }
}