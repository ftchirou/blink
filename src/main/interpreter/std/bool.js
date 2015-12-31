import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class BoolClass extends Class {

    constructor() {
        super();

        this.name = Types.Bool;

        this.superClass = Types.Object;

        this.variables.push(new Formal('value', 'bool'));

        this.methods.push(new Method('unary_!', [], Types.Bool,
            new NativeExpression((context) => {
                let result = Obj.create(context, Types.Bool);

                result.set('value', !result.get('value'));

                return result;
            })));

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', context.self.get('value').toString());

                return value;
            }), true));

        this.methods.push(new Method('||', [new Formal('rhs', Types.Bool)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let value = Obj.create(context, Types.Bool);

                value.set('value', lhs.get('value') || rhs.get('value'));

                return value;
            })));

        this.methods.push(new Method('&&', [new Formal('rhs', Types.Bool)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let value = Obj.create(context, Types.Bool);

                value.set('value', lhs.get('value') && rhs.get('value'));

                return value;
            })));

        this.methods.push(new Method('==', [new Formal('rhs', Types.Bool)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') === rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.Bool)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('rhs'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') !== rhs.get('value'));

                return result;
            })));
    }
}