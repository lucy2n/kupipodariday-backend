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
    const user = await this.usersService.findById(userId);
    const wishes = createWishlistDto.itemsId.map((id) => {
      // Возвращаются Promise { <pending> }
      return this.wishesService.findWishById(id);
    });
    // Т.к. выше возвращаются Promise { <pending> }, то нам нужно вернуть из них информацию
    return Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistRepository.create({
        ...createWishlistDto,
        items: items,
        owner: user,
      });
      return this.wishlistRepository.save(wishlist);
    });
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    if (userId !== wishlist.owner.id) {
      throw new NotAcceptableException(
        'Чужие коллекции недоступны для редактирования',
      );
    }
    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async removeWishlist(id: number, userId: number) {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    if (userId !== wishlist.owner.id) {
      throw new NotAcceptableException(
        'Чужие коллекции недоступны для редактирования',
      );
    }
    return this.wishlistRepository.remove(wishlist);
  }
}
