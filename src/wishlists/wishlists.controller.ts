import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findWishlistById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.updateWishlist(
      +id,
      updateWishlistDto,
      user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.removeWishlist(id, user.id);
  }
}
