import * as fs from 'fs'
import * as process from 'process'
import * as readline from 'readline-sync'
import { Class } from '../../ast/class'
import { Evaluator } from '../../interpreter/evaluator'
import { Formal } from '../../ast/formal'
import { Function } from '../../ast/func'
import { FunctionCall } from '../../ast/functioncall'
import { NativeExpression } from '../../ast/nativeexpression'
import { Obj } from '../../interpreter/object'
import { Reference } from '../../ast/reference'
import { Types } from '../../types/types'

export class ConsoleClass extends Class {

    constructor() {
        super();

        this.name = Types.Console;

        this.superClass = Types.Object;

        this.functions.push(new Function('println', [new Formal('s', Types.Object)], Types.Unit,
            new NativeExpression((context) => {
                let call = new FunctionCall(new Reference('s'), 'toString', []);

                let s = Evaluator.evaluate(context, call);

                console.log(s.get('value'));

                return Obj.create(context, Types.Unit);
            })));

        this.functions.push(new Function('println', [], Types.Unit,
            new NativeExpression((context) => {
                console.log();

                return Obj.create(context, Types.Unit);
            })));

        this.functions.push(new Function('readString', [new Formal('prompt', Types.String)], Types.String,
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

        this.functions.push(new Function('readInt', [new Formal('prompt', Types.String)], Types.Int,
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

        this.functions.push(new Function('readDouble', [new Formal('prompt', Types.String)], Types.Double,
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



        this.functions.push(new Function('readString', [], Types.String,
            new NativeExpression((context) => {
                process.stdin.pause();

                let input = readline.question('');

                console.log();

                let value = Obj.create(context, Types.String);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.functions.push(new Function('readInt', [], Types.Int,
            new NativeExpression((context) => {
                process.stdin.pause();

                let input = readline.questionInt('');

                console.log();

                let value = Obj.create(context, Types.Int);

                value.set('value', input);

                process.stdin.resume();

                return value;
            })));

        this.functions.push(new Function('readDouble', [], Types.Double,
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