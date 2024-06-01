import {IsNotEmpty, Min} from 'class-validator';

class UserBookDto {
    @Min(1)
    book_id: number;

    @IsNotEmpty()
    action: string;
}

export {UserBookDto};
