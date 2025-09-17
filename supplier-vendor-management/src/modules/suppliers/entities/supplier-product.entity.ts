import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('supplier_products')
export class SupplierProduct {
  @PrimaryColumn()
  supplierId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Supplier, supplier => supplier.supplierProducts, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @ManyToOne(() => Product, product => product.supplierProducts, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}