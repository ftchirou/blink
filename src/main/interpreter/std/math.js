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

        this.methods.push(new Method('ln2', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LN2);

                return value;
            })));

        this.methods.push(new Method('ln10', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LN10);

                return value;
            })));

        this.methods.push(new Method('log2e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LOG2E);

                return value;
            })));

        this.methods.push(new Method('log10e', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.LOG10E);

                return value;
            })));

        this.methods.push(new Method('pi', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.PI);

                return value;
            })));

        this.methods.push(new Method('abs', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.abs(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('abs', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.abs(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('acos', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.acos(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('acos', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.acos(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('acosh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.acosh(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('acosh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.acosh(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('asin', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.asin(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('asin', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.asin(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('asinh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.asinh(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('asinh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.asinh(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('atan', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('atan', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('atanh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('atanh', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.atan(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('cos', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.cos(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('cos', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.cos(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('cosh', [new Formal('x', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.cosh(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('ceil', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.ceil(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('floor', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.floor(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log2', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log2(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log2', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log2(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log10', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log10(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('log10', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.log10(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('max', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.max(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('max', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.max(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('min', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.min(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('min', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.min(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('pow', [new Formal('x', Types.Int), new Formal('y', Types.Int)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.pow(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('pow', [new Formal('x', Types.Double), new Formal('y', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));
                let y = context.store.get(context.environment.find('y'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.pow(x.get('value'), y.get('value')));

                return value;
            })));

        this.methods.push(new Method('random', [], Types.Double,
            new NativeExpression((context) => {
                let value = Obj.create(context, Types.Double);

                value.set('value', Math.random());

                return value;
            })));

        this.methods.push(new Method('round', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.round(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('sqrt', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sqrt(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('sqrt', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sqrt(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('sin', [new Formal('x', Types.Int)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sin(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('sin', [new Formal('x', Types.Double)], Types.Double,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Double);

                value.set('value', Math.sin(x.get('value')));

                return value;
            })));

        this.methods.push(new Method('trunc', [new Formal('x', Types.Double)], Types.Int,
            new NativeExpression((context) => {
                let x = context.store.get(context.environment.find('x'));

                let value = Obj.create(context, Types.Int);

                value.set('value', Math.trunc(x.get('value')));

                return value;
            })));
    }
}