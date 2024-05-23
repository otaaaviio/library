import {IsNotEmpty} from "class-validator";

class CreateOrEditAuthor {
    @IsNotEmpty()
    name: string;
}

export {CreateOrEditAuthor};