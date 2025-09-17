import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/modules/users/entities/user.entity';
import { Role } from '../src/modules/users/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockRoleRepository = {
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        roleId: 1,
      };

      mockUserRepository.save.mockResolvedValue({ id: 1, ...userData, passwordHash: 'hashedpassword' });

      const result = await service.create(userData.username, userData.email, userData.password, userData.roleId);

      expect(result).toEqual({ id: 1, ...userData, passwordHash: 'hashedpassword' });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user when found', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneByUsername('testuser');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('should return undefined when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOneByUsername('nonexistent');

      expect(result).toBeUndefined();
    });
  });
});