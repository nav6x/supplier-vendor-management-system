import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { SupplierProduct } from './supplier-product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactPerson: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'tinyint', nullable: true })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.supplier)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => SupplierProduct, supplierProduct => supplierProduct.supplier)
  supplierProducts: SupplierProduct[];
}