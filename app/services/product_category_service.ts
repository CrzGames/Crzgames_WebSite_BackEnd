import ProductCategory from '#models/product_category'
import NotFoundException from '#exceptions/not_found_exception'

export default class ProductCategoryService {
  public static async getAllProductCategories(): Promise<ProductCategory[]> {
    try {
      return await ProductCategory.all()
    } catch (error) {
      throw new NotFoundException('Product categories not found')
    }
  }
}
