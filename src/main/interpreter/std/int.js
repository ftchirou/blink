import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class IntClass extends Class {

    constructor() {
        super();

        this.name = Types.Int;

        this.superClass = Types.Object;

        this.variables.push(new Formal('value', 'int'));

        this.methods.push(new Method('unary_-', [], Types.Int,
            new NativeExpression((context) => {
                let result = Obj.create(context, Types.Int);

                result.set('value', -context.self.get('value'));

                return result;
            })));

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                let result = Obj.create(context, Types.String);
                result.set('value', context.self.get('value').toString());

                return result;
            }), true));

        this.methods.push(new Method('+', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Int);
                result.set('value', lhs.get('value') + rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('-', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Int);
                result.set('value', lhs.get('value') - rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('*', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Int);
                result.set('value', lhs.get('value') * rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('/', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Int);
                result.set('value', lhs.get('value') / rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('%', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Int);
                result.set('value', lhs.get('value') % rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('==', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') === rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('!=', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') !== rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('>', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') > rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('>=', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') >= rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('<', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') < rhs.get('value'));

                return result;
            })));

        this.methods.push(new Method('<=', [new Formal('x', Types.Int)], Types.Bool,
            new NativeExpression((context) => {
                let rhs = context.store.get(context.environment.find('x'));
                let lhs = context.self;

                let result = Obj.create(context, Types.Bool);
                result.set('value', lhs.get('value') <= rhs.get('value'));

                return result;
            })));
    }
}