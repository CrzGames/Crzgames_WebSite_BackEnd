import ProductCategory from 'App/Models/ProductCategory'
import { NotFoundException } from 'App/Exceptions/NotFoundException'

export default class ProductCategoryService {
  public static async getAllProductCategories(): Promise<ProductCategory[]> {
    try {
      return await ProductCategory.all()
    } catch (error) {
      throw new NotFoundException('Product categories not found')
    }
  }
}
