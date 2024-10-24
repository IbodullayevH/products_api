import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) { }

  // new product
  async create(createProductDto: CreateProductDto): Promise<object> {
    try {
      let existProduct = await this.productRepo.findOne({ where: { name: createProductDto.name } });

      if (existProduct) {
        throw new ConflictException('Product ushbu name bilan allaqachon royxatdan otgan');
      }
      const savedProduct = await this.productRepo.save(this.productRepo.create(createProductDto));

      return {
        message: 'Successfully created new Product',
        data: savedProduct,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // get all
  async findAll(): Promise<object> {
    try {
      const productsData = await this.productRepo.find()
      return {
        message: 'Products data',
        data: productsData
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // get pro count
  async getCount(): Promise<object> {
    try {
      const productsData = await this.productRepo.find()
      return {
        message: 'Products data',
        data: `${productsData.length} ta product bor`
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // find by id
  async findOne(id: number): Promise<object> {
    try {
      const productData = await this.productRepo.findOneBy({
        id

      })
      if (!productData) {
        throw new NotFoundException(`${id}-idga ega product mavjud emas`)
      }

      return {
        message: `${id}-idga ega product`,
        data: productData
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // find by name
  async findByName(name: string): Promise<object> {
    try {

      name = name.toLowerCase()
      const productData = await this.productRepo
        .createQueryBuilder('product')
        .where(`lower(product.name) = :name`, { name })
        .getOne()

      if (!productData) {
        throw new NotFoundException(`${name}-nomga ega product mavjud emas`)
      }

      return {
        message: `${name}-nomga ega product`,
        data: productData
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // Narx bo‘yicha filtrlash
  async filterByPrice(price: number): Promise<object> {
    try {

      let productDataFilterByPrice = await this.productRepo.find({
        where: {
          price: LessThanOrEqual(price)
        }
      })

      if (productDataFilterByPrice.length > 0) {
        return {
          message: `a list of products with a price of ${price}`,
          data: productDataFilterByPrice
        }
      }
      throw new NotFoundException()
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const checkId = await this.productRepo.findOneBy({ id })

      if (!checkId) {
        throw new NotFoundException(`${id}-idga ega Product mavjud emas`)
      }

      await this.productRepo.update(id, updateProductDto)
      const updatedPro = await this.productRepo.findOneBy({ id });

      return {
        message: "Productni malumotlari muvaffaqiyatli yangilandi",
        data: updatedPro
      };

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }

  async remove(id: number) {
    try {
      let checkProduct = await this.productRepo.findOneBy({ id })

      if (!checkProduct) {
        throw new NotFoundException(`${id}-idga ega Product mavjud emas`)
      }

      await this.productRepo.delete({ id })
      return {
        message: "Product muvaffaqiyatli o'chirildi"
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Qo'shimcha biznes logika: Mahsulotlar uchun chegirma tizimi
  async discount(discountAmount: number) {
    try {
      const products = await this.productRepo.find();

      const discountProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: (product.price - (product.price / 100) * discountAmount).toFixed(2),
        miqdor: product.miqdor,
      })
      )
      return {
        message: `Barcha productlarga ${discountAmount}% chegirma qilindi`,
        data: discountProducts,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  

}
