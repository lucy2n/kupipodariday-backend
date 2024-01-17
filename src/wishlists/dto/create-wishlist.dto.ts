import { Length, IsUrl, IsOptional } from 'class-validator';
export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @Length(0, 1500)
  description: string;

  @IsOptional()
  itemsId: number[];
}
