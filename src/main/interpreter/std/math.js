import { Class } from '../../ast/class'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Types } from '../../types/types'

export class MathClass extends Class {

    constructor() {
        super();

        this.name = Types.Math;

        this.superClass = Types.Object;

        this.functions.push(new Function('e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.E);

                return value;
            })));

        this.functions.push(new Function('ln2', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LN2);

                return value;
            })));

        this.functions.push(new Function('ln10', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LN10);

                return value;
            })));

        this.functions.push(new Function('log2e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LOG2E);

                return value;
            })));

        this.functions.push(new Function('log10e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LOG10E);

                return value;
            })));

        this.functions.push(new Function('pi', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.PI);

                return value;
            })));

        this.functions.push(new Function('abs', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.abs(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('abs', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.abs(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('acos', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.acos(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('acos', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.acos(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('acosh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.acosh(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('acosh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.acosh(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('asin', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.asin(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('asin', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.asin(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('asinh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.asinh(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('asinh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.asinh(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('atan', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('atan', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('atanh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('atanh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('cos', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.cos(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('cos', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.cos(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('cosh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.cosh(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('ceil', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.ceil(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('floor', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.floor(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log2', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log2(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log2', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log2(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log10', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log10(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('log10', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log10(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('max', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.max(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('max', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.max(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('min', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.min(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('min', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.min(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('pow', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.pow(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('pow', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.pow(x.get('value'), y.get('value')));

                return value;
            })));

        this.functions.push(new Function('random', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.random());

                return value;
            })));

        this.functions.push(new Function('random', [new Formal('min', Types.Int), new Formal('max', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let min = context.store.get(context.environment.find('min')).get('value');
                let max = context.store.get(context.environment.find('max')).get('value');

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.floor(Math.random() * (max - min + 1) + min));

                return value;
            })));

        this.functions.push(new Function('round', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.round(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('sqrt', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sqrt(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('sqrt', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sqrt(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('sin', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sin(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('sin', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sin(x.get('value')));

                return value;
            })));

        this.functions.push(new Function('trunc', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.trunc(x.get('value')));

                return value;
            })));
    }
}
