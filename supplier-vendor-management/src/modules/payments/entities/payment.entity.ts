import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, invoice => invoice.payments)
  invoice: Invoice;

  @Column()
  invoiceId: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
}