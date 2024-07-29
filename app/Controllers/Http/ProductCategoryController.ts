import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductCategoryService from 'App/Services/ProductCategoryService'
import ProductCategory from 'App/Models/ProductCategory'

export default class ProductCategoryController {
  private async getAllProductCategories({ response }: HttpContextContract): Promise<void> {
    const productCategories: ProductCategory[] =
      await ProductCategoryService.getAllProductCategories()
    return response.status(200).json(productCategories)
  }
}
