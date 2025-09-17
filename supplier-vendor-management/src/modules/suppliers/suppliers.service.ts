import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(SupplierProduct)
    private supplierProductRepository: Repository<SupplierProduct>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.suppliersRepository.create(createSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    return this.suppliersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    await this.suppliersRepository.update(id, updateSupplierDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.suppliersRepository.delete(id);
  }

  async addProductToSupplier(supplierId: number, productId: number, price: number): Promise<SupplierProduct> {
    const supplierProduct = this.supplierProductRepository.create({
      supplierId,
      productId,
      price,
    });
    return this.supplierProductRepository.save(supplierProduct);
  }
}