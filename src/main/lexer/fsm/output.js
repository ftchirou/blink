export class Output {
    constructor(recognized, value, lastCharacterRead) {
        this.recognized = recognized;
        this.value = value;
        this.lastCharacterRead = lastCharacterRead;
    }
}