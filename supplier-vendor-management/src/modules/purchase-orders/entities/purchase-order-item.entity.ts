import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.purchaseOrderItems)
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: number;

  @ManyToOne(() => Product, product => product.purchaseOrderItems)
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}