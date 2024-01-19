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

  create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
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
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findWishesById(id: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findUsersWishes(ownerId: number): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: {
        owner: true,
      },
    });
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    return await this.wishRepository.find({
      where: { owner: { username: username } },
      relations: {
        owner: true,
      },
    });
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotAcceptableException(
        'Чужие подарки недоступны для редактирования',
      );
    }
    if (wish.raised > 0 && updateWishDto.price > 0) {
      throw new NotAcceptableException(
        'Нельзя изменить стоимость подарка, потому что уже есть желающие скинуться.',
      );
    }
    return this.wishRepository.save({ ...wish, ...updateWishDto });
  }

  // TODO: Добелать функцию
  async copyWish(id: number, user: User) {
    const wish = await this.findWishById(id);
    const newWish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id === wish.owner.id) {
      throw new NotAcceptableException(
        'Свои подарки недоступны для добавления',
      );
    }
    const isAlreadyCopied = await this.wishRepository.findOne({
      where: {
        owner: { id: user.id },
        name: wish.name,
      },
    });
    if (isAlreadyCopied) {
      throw new NotAcceptableException('Подарок уже добавлен');
    }

    wish.copied += 1;
    await this.wishRepository.save(wish);

    delete newWish.id;
    delete newWish.offers;
    return this.create({ ...newWish, raised: 0, copied: 0 }, user);
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotAcceptableException('Чужие подарки недоступны для удаления');
    }
    return this.wishRepository.remove(wish);
  }
}
