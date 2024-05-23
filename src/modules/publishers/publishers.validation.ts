import {IsNotEmpty} from "class-validator";

class CreateOrEditPublisher {
    @IsNotEmpty()
    name: string;
}

export {CreateOrEditPublisher};