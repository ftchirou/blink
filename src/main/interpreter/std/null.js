import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../object'
import { Types } from '../../types/types'

export class NullClass extends Class {

    constructor() {
        super();

        this.name = Types.Null;

        this.functions.push(new Function('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', 'null');

                return value;
            }), true));

        this.functions.push(new Function('==', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.store.get(context.environment.find('rhs')).type === Types.Null);

                return value;
            })));

        this.functions.push(new Function('!=', [new Formal('rhs', Types.Object)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.store.get(context.environment.find('rhs')).type !== Types.Null);

                return value;
            })));
    }
}