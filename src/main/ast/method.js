import { Definition } from './definition'

export class Method extends Definition {

    constructor(name, parameters = [], returnType, body, override) {
        super();

        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.body = body;
        this.override = override;
    }

    isMethod() {
        return true;
    }

    equals(method) {
        if (this.name !== method.name) {
            return false;
        }

        for (let i = 0, length = parameters.length; i < length; ++i) {
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
        let sign = '(';
        let parametersCount = this.parameters.length;

        if (parametersCount > 0) {
            for (let i = 0; i < parametersCount - 1; ++i) {
                sign += this.parameters[i].type + ',';
            }

            sign += this.parameters[parametersCount - 1].type;
        }

        sign += ')';

        if (this.returnType !== undefined) {
            sign += ':' + this.returnType;
        }

        return sign;
    }
}