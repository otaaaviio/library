import { IsNotEmpty } from 'class-validator';

class CreateOrEditAuthorValidation {
  @IsNotEmpty()
  name: string;
}

export { CreateOrEditAuthorValidation };
