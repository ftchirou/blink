import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { FunctionCall } from '../../ast/functioncall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Reference } from '../../ast/reference'
import { Types } from '../../types/types'

export class PredefClass extends Class {

    constructor() {
        super();

        this.name = Types.Predef;

        this.superClass = Types.Object;

        this.functions.push(new Function('toString', [], Types.String,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.String);

                value.set('value', '__predef__');

                return value;
            }), true));
    }
}