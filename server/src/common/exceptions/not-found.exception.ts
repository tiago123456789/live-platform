import { ApplicationException } from "./application.exception";

export class NotFoundException extends ApplicationException {

    constructor(message) {
        super(message);
    }

    getStatusCode(): number {
        return 404;
    }

}