import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class MathClass extends Class {

    constructor() {
        super();

        this.name = Types.Math;

        this.superClass = Types.Object;

        this.methods.push(new Method('e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.E);

                return value;
            })));
    }
}