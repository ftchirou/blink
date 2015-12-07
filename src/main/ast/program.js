export class Program {

    constructor(classes = []) {
        this.classes = classes;
    }

    classesCount() {
        return this.classes.length;
    }
}