import type { HttpContext } from '@adonisjs/core/http'
import ProductCategoryService from '#services/product_category_service'
import type ProductCategory from '#models/product_category'

export default class ProductCategoryController {
  public async getAllProductCategories({ response }: HttpContext): Promise<void> {
    const productCategories: ProductCategory[] = await ProductCategoryService.getAllProductCategories()
    return response.status(200).json(productCategories)
  }
}
