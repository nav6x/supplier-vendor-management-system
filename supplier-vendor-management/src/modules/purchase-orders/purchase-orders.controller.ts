import { Controller, Get, Post, Body, Param, ParseIntPipe, Put } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  async create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Get()
  async findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrdersService.findOne(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.purchaseOrdersService.updateStatus(id, status);
  }
}