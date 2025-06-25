import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserGameLibraryFactory } from '#database/factories/user_game_library_factory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await UserGameLibraryFactory.createMany(20)
  }
}
