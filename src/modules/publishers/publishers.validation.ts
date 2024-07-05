import { IsNotEmpty } from 'class-validator';

class CreateOrEditPublisherValidation {
  @IsNotEmpty()
  name: string;
}

export { CreateOrEditPublisherValidation };
