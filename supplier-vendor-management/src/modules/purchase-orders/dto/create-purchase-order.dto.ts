import { IsInt, IsDate, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @IsInt()
  @IsNotEmpty()
  createdById: number;

  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}