import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.invoices)
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: number;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column()
  status: string;

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];
}