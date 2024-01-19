import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ default: '' })
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
