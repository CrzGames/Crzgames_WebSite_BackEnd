import { BaseSeeder } from '@adonisjs/lucid/seeders'
import GamePlatform from '#models/game_platform'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']
  public async run(): Promise<void> {
    const platformsData = [
      { name: 'Windows' },
      { name: 'macOS' },
      { name: 'Linux' },
      { name: 'iOS' },
      { name: 'Android' },
      { name: 'PlayStation®5' },
      { name: 'PlayStation®4' },
      { name: 'Xbox Series X|S' },
      { name: 'Xbox One' },
      { name: 'Nintendo Switch' },
      { name: 'HTML5' },
      { name: 'Microsoft Store' },
      { name: 'Steam' },
    ]

    for (const data of platformsData) {
      await GamePlatform.firstOrCreate({ name: data.name }, data)
    }
  }
}
