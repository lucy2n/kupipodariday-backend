import { instanceToPlain } from 'class-transformer';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { UseGuards, Post, Controller, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@AuthUser() user): Promise<any> {
    console.log(user);
    return this.authService.auth(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.signup(createUserDto);
    return instanceToPlain(user);
  }
}
