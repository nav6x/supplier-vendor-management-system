import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log('createProduct called');
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    this.logger.log('findAllProducts called');
    return this.productsRepository.find();
  }

  async findOneProduct(id: number): Promise<Product> {
    this.logger.log(`findOneProduct called with id: ${id}`);
    return this.productsRepository.findOne({ where: { id } });
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log('createCategory called');
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    this.logger.log('findAllCategories called');
    return this.categoriesRepository.find();
  }

  async findOneCategory(id: number): Promise<Category> {
    this.logger.log(`findOneCategory called with id: ${id}`);
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async addProductToCategory(productId: number, categoryId: number): Promise<ProductCategory> {
    this.logger.log(`addProductToCategory called with productId: ${productId}, categoryId: ${categoryId}`);
    const productCategory = this.productCategoryRepository.create({
      productId,
      categoryId,
    });
    return this.productCategoryRepository.save(productCategory);
  }
}