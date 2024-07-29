import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GamePlatform from 'App/Models/GamePlatform'

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
