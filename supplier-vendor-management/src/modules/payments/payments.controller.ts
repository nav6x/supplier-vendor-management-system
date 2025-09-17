import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Get('invoice/:invoiceId')
  async findByInvoiceId(@Param('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.paymentsService.findByInvoiceId(invoiceId);
  }
}