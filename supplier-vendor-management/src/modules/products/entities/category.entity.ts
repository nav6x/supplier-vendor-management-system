import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ProductCategory, productCategory => productCategory.category)
  productCategories: ProductCategory[];
}