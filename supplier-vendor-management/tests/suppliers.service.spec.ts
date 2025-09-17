import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from '../src/modules/suppliers/suppliers.service';
import { Supplier } from '../src/modules/suppliers/entities/supplier.entity';
import { SupplierProduct } from '../src/modules/suppliers/entities/supplier-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockSupplierRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockSupplierProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
        {
          provide: getRepositoryToken(SupplierProduct),
          useValue: mockSupplierProductRepository,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new supplier', async () => {
      const supplierData = {
        name: 'Test Supplier',
        email: 'test@supplier.com',
      };

      const supplier = new Supplier();
      supplier.id = 1;
      supplier.name = supplierData.name;
      supplier.email = supplierData.email;

      mockSupplierRepository.create.mockReturnValue(supplier);
      mockSupplierRepository.save.mockResolvedValue(supplier);

      const result = await service.create(supplierData);

      expect(result).toEqual(supplier);
      expect(mockSupplierRepository.create).toHaveBeenCalledWith(supplierData);
      expect(mockSupplierRepository.save).toHaveBeenCalledWith(supplier);
    });
  });

  describe('findAll', () => {
    it('should return an array of suppliers', async () => {
      const suppliers = [
        { id: 1, name: 'Supplier 1', email: 'supplier1@example.com' },
        { id: 2, name: 'Supplier 2', email: 'supplier2@example.com' },
      ];

      mockSupplierRepository.find.mockResolvedValue(suppliers);

      const result = await service.findAll();

      expect(result).toEqual(suppliers);
      expect(mockSupplierRepository.find).toHaveBeenCalled();
    });
  });
});