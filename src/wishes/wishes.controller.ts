import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findLastWishes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findWishById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param('id') id: number,
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.updateWish(id, updateWishDto, user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: number, @AuthUser() user: User): Promise<Wish> {
    return this.wishesService.copyWish(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @AuthUser() user: User): Promise<Wish> {
    return this.wishesService.removeWish(id, user.id);
  }
}
