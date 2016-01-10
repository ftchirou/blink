import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class BoolClass extends Class {

    constructor() {
        super();

        this.name = Types.Bool;

        this.superClass = Types.Object;

        this.properties.push(new Formal('value', 'bool'));

        this.functions.push(new Function('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', context.self.get('value').toString());

                return value;
            }), true));

        this.functions.push(new Function('==', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let value = Obj.create(context, Types.Bool);

                if (rhs.type !== Types.Bool) {
                    value.set('value', false);
                } else {
                    value.set('value', lhs.get('value') === rhs.get('value'));
                }

                return value;
            }), true));

        this.functions.push(new Function('unary_!', [], Types.Bool,
            new NativeExpression((context) => {
                let result = Obj.create(context, Types.Bool);

                result.set('value', !context.self.get('value'));

                return result;
            })));

        this.functions.push(new Function('&&', [new Formal('rhs', Types.Bool, true)], Types.Bool,
            new NativeExpression((context) => {
                let lhs = context.self;

                let value = Obj.create(context, Types.Bool);

                if (lhs.get('value') === false) {
                    value.set('value', false);

                } else {
                    let address = context.environment.find('rhs');

                    let rhs = context.store.get(address);

                    rhs = Evaluator.evaluate(rhs.context, rhs.expression);

                    context.store.put(address, rhs);

                    value.set('value', rhs.get('value'));
                }

                return value;
            })));

        this.functions.push(new Function('||', [new Formal('rhs', Types.Bool, true)], Types.Bool,
            new NativeExpression((context) => {
                let lhs = context.self;

                let value = Obj.create(context, Types.Bool);

                if (lhs.get('value') === true) {
                    value.set('value', true);

                } else {
                    let address = context.environment.find('rhs');

                    let rhs = context.store.get(address);

                    rhs = Evaluator.evaluate(rhs.context, rhs.expression);

                    context.store.put(address, rhs);

                    value.set('value', rhs.get('value'));
                }

                return value;
            })));
    }
}