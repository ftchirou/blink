import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { MethodCall } from '../../ast/methodcall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Reference } from '../../ast/reference'
import { Types } from '../../types/types'

export class StringClass extends Class {

    constructor() {
        super();

        this.name = Types.String;

        this.superClass = Types.Object;

        this.variables.push(new Formal('value', 'string'));

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                return context.self;
            }), true));

        this.methods.push(new Method('+', [new Formal('rhs', Types.Object)], Types.String,
            new NativeExpression((context) => {
                let call = new MethodCall(new Reference('rhs'), 'toString', []);

                let rhs = Evaluator.evaluate(context, call);
                let lhs = context.self;

                let value = Obj.create(context, Types.String);

                value.set('value', lhs.get('value') + rhs.get('value'));

                return value;
            })));

        this.methods.push(new Method('==', [new Formal('rhs', Types.String)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') === rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.String)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') !== rhs.get('value'));

                return result;
            })));
    }
}