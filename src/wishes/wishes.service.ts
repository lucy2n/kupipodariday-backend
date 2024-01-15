import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly whishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.userService.findById(userId);
    const wish = await this.whishRepository.create({ ...createWishDto, owner });

    return this.whishRepository.save(wish);
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.whishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.whishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findWishById(id: number): Promise<Wish> {
    return await this.whishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
  }

  async findWishesById(id: number): Promise<Wish> {
    return await this.whishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
  }

  async findUsersWishes(ownerId: number): Promise<Wish[]> {
    return await this.whishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    return await this.whishRepository.find({
      where: { owner: { username: username } },
      relations: ['owner'],
    });
  }

  async updateWish(id: number, updateUserDto: UpdateWishDto, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotFoundException(
        'Чужие подарки недоступны для редактирования',
      );
    }
    return this.whishRepository.save({ ...wish, ...updateUserDto });
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.findWishById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new NotFoundException('Чужие подарки недоступны для удаления');
    }
    return this.whishRepository.remove(wish);
  }
}
