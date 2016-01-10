import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class UnitClass extends Class {

    constructor() {
        super();

        this.name = Types.Unit;

        this.superClass = Types.Object;

        this.functions.push(new Function('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', '()');

                return value;
            }), true));
    }
}