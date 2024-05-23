import {IsEmail, IsNotEmpty, IsNumber, IsString, Length, Min} from "class-validator";

interface TokenPayload {
    session_id: string;
    user_id: number;
}

class TokenDto {
    @IsNotEmpty()
    session_id: string;

    @Min(1)
    user_id: number;
}

class SessionDto {
    @IsEmail()
    email: string;

    @Length(6)
    password: string;
}

export {SessionDto, TokenPayload, TokenDto};