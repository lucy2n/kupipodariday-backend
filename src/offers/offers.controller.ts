import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user) {
    return this.offersService.createOffer(createOfferDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.offersService.findOfferById(+id);
  }
}
