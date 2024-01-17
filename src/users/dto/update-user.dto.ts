import {
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  IsString,
} from 'class-validator';
export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username: string;

  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  password: string;
}
