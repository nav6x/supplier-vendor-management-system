import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(username: string, email: string, password: string, roleId: number): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.roleId = roleId;
    
    return this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async createRole(roleName: string): Promise<Role> {
    const role = new Role();
    role.roleName = roleName;
    return this.rolesRepository.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update fields if provided
    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.roleId !== undefined) {
      user.roleId = updateUserDto.roleId;
    }
    if (updateUserDto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    return this.usersRepository.save(user);
  }
}