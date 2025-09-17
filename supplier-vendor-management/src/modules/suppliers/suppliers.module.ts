import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierProduct])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService, TypeOrmModule],
})
export class SuppliersModule {}