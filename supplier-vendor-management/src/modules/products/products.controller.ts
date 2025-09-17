import { Controller, Get, Post, Body, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    this.logger.log('createProduct called');
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  async findAllProducts() {
    this.logger.log('findAllProducts called');
    return this.productsService.findAllProducts();
  }

  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.log('createCategory called');
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  async findAllCategories() {
    this.logger.log('findAllCategories called');
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  async findOneCategory(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`findOneCategory called with id: ${id}`);
    return this.productsService.findOneCategory(id);
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`findOneProduct called with id: ${id}`);
    return this.productsService.findOneProduct(id);
  }
}