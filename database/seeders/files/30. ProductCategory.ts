import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProductCategory from 'App/Models/ProductCategory'

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
