import * as fs from 'fs'
import * as process from 'process'
import * as readline from 'readline-sync'
import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Method } from '../../ast/method'
import { MethodCall } from '../../ast/methodcall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Reference } from '../../ast/reference'
import { Types } from '../../types/types'

export class ConsoleClass extends Class {

    constructor() {
        super();

        this.name = Types.Console;

        this.superClass = Types.Object;

        this.methods.push(new Method('println', [new Formal('s', Types.Object)], Types.Unit,
            new NativeExpression((context) => {
                let call = new MethodCall(new Reference('s'), 'toString', []);

                let s = Evaluator.evaluate(context, call);

                console.log(s.get('value'));

                return Obj.create(context, Types.Unit);
            })));

        this.methods.push(new Method('readString', [new Formal('prompt', Types.String)], Types.String,
            new NativeExpression((context) => {
                process.stdin.pause();

                let prompt = context.store.get(context.environment.find('prompt'));

                let input = readline.question(prompt.get('value'));

                console.log();

                let value = Obj.create(context, Types.String);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.methods.push(new Method('readInt', [new Formal('prompt', Types.String)], Types.Int,
            new NativeExpression((context) => {
                process.stdin.pause();

                let prompt = context.store.get(context.environment.find('prompt'));

                let input = readline.questionInt(prompt.get('value'));

                console.log();

                let value = Obj.create(context, Types.Int);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.methods.push(new Method('readDouble', [new Formal('prompt', Types.String)], Types.Double,
            new NativeExpression((context) => {
                process.stdin.pause();

                let prompt = context.store.get(context.environment.find('prompt'));

                let input = readline.questionFloat(prompt.get('value'));

                console.log();

                let value = Obj.create(context, Types.Double);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));



        this.methods.push(new Method('readString', [], Types.String,
            new NativeExpression((context) => {
                process.stdin.pause();

                let input = readline.question('');

                console.log();

                let value = Obj.create(context, Types.String);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.methods.push(new Method('readInt', [], Types.Int,
            new NativeExpression((context) => {
                process.stdin.pause();

                let input = readline.questionInt('');

                console.log();

                let value = Obj.create(context, Types.Int);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.methods.push(new Method('readDouble', [], Types.Double,
            new NativeExpression((context) => {
                process.stdin.pause();

                let input = readline.questionFloat('');

                console.log();

                let value = Obj.create(context, Types.Double);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));
    }
}