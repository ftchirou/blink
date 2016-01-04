import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
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

        this.methods.push(new Method('==', [new Formal('rhs', Types.Null)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.self.type === Types.Null);

                return value;
            })));

        this.methods.push(new Method('!=', [new Formal('rhs', Types.Null)], Types.Bool,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Bool);

                value.set('value', context.self.type !== Types.Null);

                return value;
            })));
    }
}