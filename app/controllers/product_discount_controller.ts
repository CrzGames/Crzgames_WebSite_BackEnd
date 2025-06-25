import { HttpContext } from '@adonisjs/core/http'
import { ProductDiscountService, ProductDiscountCommand } from '#services/product_discount_service'
import UpdateProductDiscountValidator from '#validators/product_discount/update_product_discount_validator'
import CreateProductDiscountValidator from '#validators/product_discount/create_product_discount_validator'
import ProductDiscount from '#models/product_discount'

export default class ProductDiscountController {
  public async createProductDiscount({ request, response }: HttpContext): Promise<void> {
    const payload: ProductDiscountCommand = await request.validate(CreateProductDiscountValidator)
    const productDiscount: ProductDiscount = await ProductDiscountService.createProductDiscount(payload)
    return response.created(productDiscount)
  }

  public async getProductDiscountById({ params, response }: HttpContext): Promise<void> {
    const productDiscount: ProductDiscount | null = await ProductDiscountService.getProductDiscountById(params.id)
    if (productDiscount) {
      return response.status(200).json(productDiscount)
    } else {
      return response.notFound()
    }
  }

  public async getAllProductDiscountsByProductId({ params, response }: HttpContext): Promise<void> {
    const productDiscounts: ProductDiscount[] = await ProductDiscountService.getAllProductDiscountsByProductId(
      params.productId,
    )
    return response.status(200).json(productDiscounts)
  }

  public async updateProductDiscount({ params, request, response }: HttpContext): Promise<void> {
    const payload: ProductDiscountCommand = await request.validate(UpdateProductDiscountValidator)
    const productDiscount: ProductDiscount = await ProductDiscountService.updateProductDiscount(params.id, payload)
    return response.status(200).json(productDiscount)
  }

  public async deleteProductDiscount({ params, response }: HttpContext): Promise<void> {
    await ProductDiscountService.deleteProductDiscount(params.id)
    return response.noContent()
  }
}
