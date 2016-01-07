export class Report {

    static error(line, column, message) {
        if (line === undefined || column === undefined) {
            return message;
        }

        return `${line + 1}:${column + 1}: ${message}`;
    }
}