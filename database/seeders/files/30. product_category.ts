import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ProductCategory from '#models/product_category'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const productCategories = [
      {
        name: 'ingame',
      },
      {
        name: 'game',
      },
    ]

    for (const productCategorie of productCategories) {
      await ProductCategory.firstOrCreate({ name: productCategorie.name }, productCategorie)
    }
  }
}
