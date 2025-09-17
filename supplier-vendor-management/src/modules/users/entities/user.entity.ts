import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @Column()
  roleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.createdBy)
  purchaseOrders: PurchaseOrder[];
}