import {HttpException, HttpStatus} from "@nestjs/common";

export class NotAllowedException extends HttpException {
    constructor() {
        super(
            `You are not allowed to perform this action`,
            HttpStatus.FORBIDDEN
        );
    }
}