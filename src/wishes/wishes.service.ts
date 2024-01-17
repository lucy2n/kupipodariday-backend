import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.userService.findById(userId);
    const wish = await this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findWishById(id: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async findWishesById(id: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
  }

  async findUsersWishes(ownerId: number): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { owner: { username: username } },
      relations: ['owner'],
    });
  }

  async updateWish(id: number, updateUserDto: UpdateWishDto, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.raised > 0 && updateUserDto.price > 0) {
      throw new NotAcceptableException(
        'Нельзя изменить стоимость подарка, потому что уже есть желающие скинуться.',
      );
    }
    if (userId !== wish.owner.id) {
      throw new NotAcceptableException(
        'Чужие подарки недоступны для редактирования',
      );
    }
    return this.wishRepository.save({ ...wish, ...updateUserDto });
  }

  // TODO: Добелать функцию
  async copyWish(id: number, user: User) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id !== wish.owner.id) {
      throw new NotAcceptableException(
        'Свои подарки недоступны для добавления',
      );
    }
    await this.wishRepository.update(id, {
      copied: (wish.copied += 1),
    });
    await this.create({ ...wish, raised: 0 }, user.id);
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotFoundException('Чужие подарки недоступны для удаления');
    }
    return this.wishRepository.remove(wish);
  }
}
