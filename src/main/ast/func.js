import { Definition } from './definition'
import { Types } from '../types/types'

export class Function extends Definition {

    constructor(name, parameters = [], returnType, body, override = false, isPrivate = false) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.body = body;
        this.override = override;
        this.isPrivate = isPrivate;
    }

    isFunction() {
        return true;
    }

    equals(method) {
        if (this.name !== method.name) {
            return false;
        }

        if (this.parameters.length !== method.parameters.length) {
            return false;
        }

        for (let i = 0, length = this.parameters.length; i < length; ++i) {
            if (this.parameters[i].type !== method.parameters[i].type) {
                return false;
            }
        }

        if (this.returnType !== method.returnType) {
            return false;
        }

        return true;
    }

    signature() {
        let sign = this.name + '(';
        let parametersCount = this.parameters.length;

        if (parametersCount > 0) {
            sign += this.parameters[0].identifier + ': ' + this.parameters[0].type;

            for (let i = 1; i < parametersCount; ++i) {
                sign += ', ' + this.parameters[i].identifier + ': ' + this.parameters[i].type;
            }
        }

        sign += ')';

        if (this.returnType !== Types.Unit) {
            sign += ': ' + this.returnType;
        }

        return sign;
    }
}