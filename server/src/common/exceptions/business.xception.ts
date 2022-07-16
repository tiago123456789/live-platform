import { ApplicationException } from "./application.exception";

export class BusinessException extends ApplicationException {

    constructor(message) {
        super(message);
    }

    getStatusCode(): number {
        return 409;
    }

}