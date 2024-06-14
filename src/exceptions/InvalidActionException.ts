import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidActionException extends HttpException {
    constructor() {
        super('Invalid action', HttpStatus.BAD_REQUEST);
    }
}