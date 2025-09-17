import { IsInt, IsDate, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  purchaseOrderId: number;

  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;
}