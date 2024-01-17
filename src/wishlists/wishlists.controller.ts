import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishDto: CreateWishlistDto,
    @AuthUser() user,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findWishlistById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.removeWish(id, user.id);
  }
}
