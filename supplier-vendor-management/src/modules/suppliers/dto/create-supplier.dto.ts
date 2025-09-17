import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  rating?: number;
}