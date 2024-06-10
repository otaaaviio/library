import { IsEmail, Length } from 'class-validator';

interface TokenPayload {
  session_id: string;
  user_id: number;
}

class SessionDto {
  @IsEmail()
  email: string;

  @Length(6)
  password: string;
}

export { SessionDto, TokenPayload };
