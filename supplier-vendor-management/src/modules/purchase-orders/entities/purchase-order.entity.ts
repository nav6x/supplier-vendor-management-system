import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { User } from '../../users/entities/user.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, supplier => supplier.purchaseOrders)
  supplier: Supplier;

  @Column()
  supplierId: number;

  @ManyToOne(() => User, user => user.purchaseOrders)
  createdBy: User;

  @Column()
  createdById: number;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PurchaseOrderItem, purchaseOrderItem => purchaseOrderItem.purchaseOrder)
  purchaseOrderItems: PurchaseOrderItem[];

  @OneToMany(() => Invoice, invoice => invoice.purchaseOrder)
  invoices: Invoice[];
}