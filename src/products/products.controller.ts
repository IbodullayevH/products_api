import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('new')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Ombordagi mahsulotlar miqdorini ko‘rish
  @Get('count')
  getCount() {
    return this.productsService.getCount()
  }

  @Get(':id')
  findOne(@Param(`id`) id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('name/:name')
  findfindByName(@Param(`name`) name: string) {
    return this.productsService.findByName(name);
  }

  @Get('price/:price')
  filterByPrice(@Param('price') price: number) {
    return this.productsService.filterByPrice(price);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('discount')
  discount(@Body('discountAmount') discountAmount: number):Promise<object> {    
    return this.productsService.discount(discountAmount)
  }
}
