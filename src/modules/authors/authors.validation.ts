import {IsNotEmpty} from "class-validator";

class CreateOrEditAuthorDto {
    @IsNotEmpty()
    name: string;
}

export {CreateOrEditAuthorDto};