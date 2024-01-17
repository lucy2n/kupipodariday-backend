import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const owner = await this.usersService.findById(userId);
    const wishes = createWishlistDto.itemsId.map((id) => {
      // Возвращаются Promise { <pending> }
      return this.wishesService.findWishById(id);
    });
    // Т.к. выше возвращаются Promise { <pending> }, то нам нужно вернуть из них информацию
    return Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistRepository.create({
        ...createWishlistDto,
        items,
        owner,
      });
      return this.wishlistRepository.save(wishlist);
    });
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: ['items', 'owner'],
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    return await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }
  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.findWishlistById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotAcceptableException('Чужие подарки недоступны для удаления');
    }
    return this.wishlistRepository.remove(wish);
  }
}
