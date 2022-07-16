
export class ApplicationException extends Error {

    constructor(message) {
        super(message);
    }

    getStatusCode(): number {
        return 500
    }
}