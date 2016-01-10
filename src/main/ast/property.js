import { Definition } from './definition'

export class Property extends Definition {

    constructor(name, type, value) {
        super();

        this.name = name;
        this.type = type;
        this.value = value;
    }

    isProperty() {
        return true;
    }
}