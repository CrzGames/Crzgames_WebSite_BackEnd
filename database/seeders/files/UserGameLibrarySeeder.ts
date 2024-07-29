import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserGameLibraryFactory } from 'Database/factories/UserGameLibraryFactory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await UserGameLibraryFactory.createMany(20)
  }
}
