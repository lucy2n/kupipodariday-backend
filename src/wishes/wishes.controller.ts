import {
  Controller,
  Post,
  Body,
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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
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
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(+id);
  }
}
