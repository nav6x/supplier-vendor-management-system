import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({
      relations: ['invoice'],
    });
  }

  async findOne(id: number): Promise<Payment> {
    return this.paymentsRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });
  }

  async findByInvoiceId(invoiceId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { invoiceId },
      relations: ['invoice'],
    });
  }
}