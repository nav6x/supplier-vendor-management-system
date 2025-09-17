import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      relations: ['purchaseOrder'],
    });
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoicesRepository.findOne({
      where: { id },
      relations: ['purchaseOrder'],
    });
  }

  async updateStatus(id: number, status: string): Promise<Invoice> {
    await this.invoicesRepository.update(id, { status });
    return this.findOne(id);
  }
}