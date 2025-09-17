import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  categoryId: number;

  @ManyToOne(() => Product, product => product.productCategories, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Category, category => category.productCategories, { onDelete: 'CASCADE' })
  category: Category;
}