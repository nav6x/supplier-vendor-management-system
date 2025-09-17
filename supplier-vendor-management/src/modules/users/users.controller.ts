import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
      createUserDto.roleId
    );
  }

  @Get('roles')
  async findAllRoles() {
    return this.usersService.findAllRoles();
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}