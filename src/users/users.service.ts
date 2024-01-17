import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { hashValue } from 'src/helpers/hash';
import { FindUserDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return user;
  }

  async findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  // async findAll(): Promise<User[]> {
  //   return this.usersRepository.find();
  // }

  async findMany({ query }: FindUserDto): Promise<User[]> {
    const user = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
