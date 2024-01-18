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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createWishDto: CreateWishDto, @AuthUser() user: User) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  async findLast() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  async findTop() {
    return this.wishesService.findLastWishes();
  }

  @Get(':id')
  async findWishById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  // @Get()
  // findAll() {
  //   return this.wishesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wishesService.findOne(+id);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param('id') id: number,
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(id, updateWishDto, user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copyWish(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.removeWish(id, user.id);
  }
}
