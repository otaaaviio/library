import {IsEmail, IsNotEmpty, IsOptional, Length} from "class-validator";

class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @Length(6)
    password: string;

    @IsEmail()
    email: string;
}

class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @Length(6)
    @IsOptional()
    password: string;

    @IsEmail()
    @IsOptional()
    email: string;
}

export {CreateUserDto, UpdateUserDto};