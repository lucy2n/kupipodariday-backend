import { Injectable } from '@nestjs/common';
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
    return this.whishRepository.create(createWishDto);
  }

  // findAll() {
  //   return `This action returns all wishes`;
  // }

  async findWishById(ownerId: number) {
    return await this.whishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
