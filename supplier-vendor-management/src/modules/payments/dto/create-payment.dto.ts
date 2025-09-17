import { IsInt, IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  invoiceId: number;

  @IsDate()
  @Type(() => Date)
  paymentDate: Date;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}