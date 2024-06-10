import {IsNotEmpty, Min, IsOptional} from 'class-validator';

class UserBookDto {
    @Min(1)
    book_id: number;

    @IsNotEmpty()
    action: string;

    @IsOptional()
    is_read: boolean;
}

export {UserBookDto};
