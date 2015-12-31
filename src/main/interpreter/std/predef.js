import { Class } from '../../ast/class'
import { Method } from '../../ast/method'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class PredefClass extends Class {

    constructor() {
        super();

        this.name = Types.Predef;

        this.superClass = Types.Object;

        this.methods.push(new Method('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', '__predef__');

                return value;
            }), true));
    }
}