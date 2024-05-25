import { IsNotEmpty } from 'class-validator';

class CreateOrEditPublisherDto {
  @IsNotEmpty()
  name: string;
}

export { CreateOrEditPublisherDto };
