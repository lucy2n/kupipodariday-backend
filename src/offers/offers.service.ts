import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishService: WishesService,
  ) {}
  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number,
  ): Promise<Offer> {
    const user = await this.userService.findById(userId);
    const wish = await this.wishService.findWishById(createOfferDto.itemId);
    const total = Number(wish.raised) + createOfferDto.amount;
    if (user.id === wish.owner.id) {
      throw new NotAcceptableException('Нельзя скинуть деньги на свой подарок');
    }
    if (total > wish.price || wish.raised === wish.price) {
      throw new NotAcceptableException(
        'Сумма вложения превышает нужный остаток для покупки подарка или сумма уже набрана',
      );
    }
    await this.wishService.updateWish(
      wish.id,
      { raised: total },
      wish.owner.id,
    );

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    return this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findOfferById(id: number): Promise<Offer> {
    return await this.offerRepository.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });
  }
}
