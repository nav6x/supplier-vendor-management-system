import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductCategory } from './entities/product-category.entity';
import { SupplierProduct } from '../suppliers/entities/supplier-product.entity';
import { PurchaseOrderItem } from '../purchase-orders/entities/purchase-order-item.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductCategory, SupplierProduct, PurchaseOrderItem])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}