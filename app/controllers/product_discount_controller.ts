import type { HttpContext } from '@adonisjs/core/http'
import { ProductDiscountService } from '#services/product_discount_service'
import type { ProductDiscountCommand } from '#services/product_discount_service'
import { updateProductDiscountValidator } from '#validators/product_discount/update_product_discount_validator'
import { createProductDiscountValidator } from '#validators/product_discount/create_product_discount_validator'
import type ProductDiscount from '#models/product_discount'

/**
 *
 */
export default class ProductDiscountController {
  /**
   *
   */
  public async createProductDiscount({ request, response }: HttpContext): Promise<void> {
    const payload: ProductDiscountCommand = await request.validateUsing(createProductDiscountValidator)
    const productDiscount: ProductDiscount = await ProductDiscountService.createProductDiscount(payload)
    response.created(productDiscount)
  }

  /**
   *
   */
  public async getProductDiscountById({ params, response }: HttpContext): Promise<void> {
    const productDiscount: ProductDiscount | null = await ProductDiscountService.getProductDiscountById(params.id)

    if (productDiscount !== null) {
      response.status(200).json(productDiscount)
      return
    }

    response.notFound()
  }

  /**
   *
   */
  public async getAllProductDiscountsByProductId({ params, response }: HttpContext): Promise<void> {
    const productDiscounts: ProductDiscount[] = await ProductDiscountService.getAllProductDiscountsByProductId(
      params.productId,
    )
    response.status(200).json(productDiscounts)
  }

  /**
   *
   */
  public async updateProductDiscount({ params, request, response }: HttpContext): Promise<void> {
    const payload: ProductDiscountCommand = await request.validateUsing(updateProductDiscountValidator)
    const productDiscount: ProductDiscount = await ProductDiscountService.updateProductDiscount(params.id, payload)
    response.status(200).json(productDiscount)
  }

  /**
   *
   */
  public async deleteProductDiscount({ params, response }: HttpContext): Promise<void> {
    await ProductDiscountService.deleteProductDiscount(params.id)
    response.noContent()
  }
}
