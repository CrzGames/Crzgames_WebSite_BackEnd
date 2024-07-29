import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ProductDiscountService, ProductDiscountCommand } from 'App/Services/ProductDiscountService'
import UpdateProductDiscountValidator from 'App/Validators/ProductDiscount/UpdateProductDiscountValidator'
import CreateProductDiscountValidator from 'App/Validators/ProductDiscount/CreateProductDiscountValidator'
import ProductDiscount from 'App/Models/ProductDiscount'

export default class ProductDiscountController {
  private async createProductDiscount({ request, response }: HttpContextContract): Promise<void> {
    const payload: ProductDiscountCommand = await request.validate(CreateProductDiscountValidator)
    const productDiscount: ProductDiscount =
      await ProductDiscountService.createProductDiscount(payload)
    return response.created(productDiscount)
  }

  private async getProductDiscountById({ params, response }: HttpContextContract): Promise<void> {
    const productDiscount: ProductDiscount | null =
      await ProductDiscountService.getProductDiscountById(params.id)
    if (productDiscount) {
      return response.status(200).json(productDiscount)
    } else {
      return response.notFound()
    }
  }

  private async getAllProductDiscountsByProductId({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const productDiscounts: ProductDiscount[] =
      await ProductDiscountService.getAllProductDiscountsByProductId(params.productId)
    return response.status(200).json(productDiscounts)
  }

  private async updateProductDiscount({
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const payload: ProductDiscountCommand = await request.validate(UpdateProductDiscountValidator)
    const productDiscount: ProductDiscount = await ProductDiscountService.updateProductDiscount(
      params.id,
      payload,
    )
    return response.status(200).json(productDiscount)
  }

  private async deleteProductDiscount({ params, response }: HttpContextContract): Promise<void> {
    await ProductDiscountService.deleteProductDiscount(params.id)
    return response.noContent()
  }
}
