import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemsRepository: Repository<PurchaseOrderItem>,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Create the purchase order
    const purchaseOrder = this.purchaseOrdersRepository.create({
      supplierId: createPurchaseOrderDto.supplierId,
      createdById: createPurchaseOrderDto.createdById,
      orderDate: createPurchaseOrderDto.orderDate,
      status: 'Pending',
    });

    const savedPurchaseOrder = await this.purchaseOrdersRepository.save(purchaseOrder);

    // Create the purchase order items
    const purchaseOrderItems = createPurchaseOrderDto.items.map(item => 
      this.purchaseOrderItemsRepository.create({
        purchaseOrderId: savedPurchaseOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );

    await this.purchaseOrderItemsRepository.save(purchaseOrderItems);

    return this.findOne(savedPurchaseOrder.id);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepository.find({
      relations: ['supplier', 'purchaseOrderItems', 'purchaseOrderItems.product'],
    });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersRepository.findOne({
      where: { id },
      relations: ['supplier', 'purchaseOrderItems', 'purchaseOrderItems.product'],
    });
  }

  async updateStatus(id: number, status: string): Promise<PurchaseOrder> {
    await this.purchaseOrdersRepository.update(id, { status });
    return this.findOne(id);
  }
}