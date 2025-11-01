import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductCategory } from './entities/product-category.entity';
import { SupplierProduct } from '../suppliers/entities/supplier-product.entity';
import { PurchaseOrderItem } from '../purchase-orders/entities/purchase-order-item.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
    @InjectRepository(SupplierProduct)
    private supplierProductRepository: Repository<SupplierProduct>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log('createProduct called');
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    this.logger.log('findAllProducts called');
    return this.productsRepository.find({
      relations: ['productCategories', 'productCategories.category', 'supplierProducts']
    });
  }

  async findOneProduct(id: number): Promise<Product> {
    this.logger.log(`findOneProduct called with id: ${id}`);
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['productCategories', 'productCategories.category', 'supplierProducts']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`updateProduct called with id: ${id}`);
    const product = await this.findOneProduct(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async removeProduct(id: number): Promise<DeleteResult> {
    this.logger.log(`removeProduct called with id: ${id}`);
    
    // Check if product exists and throw error if not found
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // First, delete related records that reference this product
    await this.purchaseOrderItemRepository.delete({ productId: id });
    await this.supplierProductRepository.delete({ productId: id });
    await this.productCategoryRepository.delete({ productId: id });
    
    // Finally, delete the product itself
    return this.productsRepository.delete(id);
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