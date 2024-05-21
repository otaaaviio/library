import {IsEmail, Length} from "class-validator";

interface TokenPayload {
    session_id: number;
    user_id: number;
}

class SessionDto {
    @IsEmail()
    email: string;

    @Length(6)
    password: string;
}

export {SessionDto, TokenPayload};