import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SupplierProduct } from '../../suppliers/entities/supplier-product.entity';
import { PurchaseOrderItem } from '../../purchase-orders/entities/purchase-order-item.entity';
import { ProductCategory } from './product-category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => SupplierProduct, supplierProduct => supplierProduct.product)
  supplierProducts: SupplierProduct[];

  @OneToMany(() => PurchaseOrderItem, purchaseOrderItem => purchaseOrderItem.product)
  purchaseOrderItems: PurchaseOrderItem[];

  @OneToMany(() => ProductCategory, productCategory => productCategory.product)
  productCategories: ProductCategory[];
}