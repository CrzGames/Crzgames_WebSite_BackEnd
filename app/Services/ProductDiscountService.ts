import ProductDiscount from 'App/Models/ProductDiscount'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'

export type ProductDiscountCommand = {
  products_id: number
  currency: string
  discount_percent: number
}

export class ProductDiscountService {
  // Create a new product discount
  public static async createProductDiscount(
    data: ProductDiscountCommand,
  ): Promise<ProductDiscount> {
    try {
      return await ProductDiscount.create(data)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Update an existing product discount
  public static async updateProductDiscount(
    id: number,
    data: ProductDiscountCommand,
  ): Promise<ProductDiscount> {
    const productDiscount: ProductDiscount = await ProductDiscount.findOrFail(id)

    try {
      productDiscount.merge(data)
      await productDiscount.save()
      return productDiscount
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Delete a product discount
  public static async deleteProductDiscount(id: number): Promise<void> {
    const productDiscount: ProductDiscount = await ProductDiscount.findOrFail(id)
    try {
      await productDiscount.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // Get all product discounts for a specific product
  public static async getAllProductDiscountsByProductId(
    productId: number,
  ): Promise<ProductDiscount[]> {
    try {
      return ProductDiscount.query().where('products_id', productId).preload('product')
    } catch (error) {
      throw new NotFoundException('Product discounts not found')
    }
  }

  // Get a single product discount by ID
  public static async getProductDiscountById(id: number): Promise<ProductDiscount | null> {
    try {
      return ProductDiscount.query().where('id', id).preload('product').firstOrFail()
    } catch (error) {
      throw new NotFoundException('Product discount not found')
    }
  }
}
