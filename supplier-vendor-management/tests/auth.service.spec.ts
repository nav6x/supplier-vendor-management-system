import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUsersService = {
  validateUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const user = { id: 1, username: 'testuser', roleId: 1 };
      mockUsersService.validateUser.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await service.signIn('testuser', 'password');

      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockUsersService.validateUser).toHaveBeenCalledWith('testuser', 'password');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 1, username: 'testuser', roleId: 1 });
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.signIn('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });
});