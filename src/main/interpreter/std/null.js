import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../object'
import { Types } from '../../types/types'

export class NullClass extends Class {

    constructor() {
        super();

        this.name = Types.Null;

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', 'null');

                return value;
            }), true));

        this.methods.push(new Method('==', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.store.get(context.environment.find('rhs')).type === Types.Null);

                return value;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.store.get(context.environment.find('rhs')).type !== Types.Null);

                return value;
            })));
    }
}