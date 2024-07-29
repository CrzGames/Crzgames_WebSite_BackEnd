import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { GameChangeLogFactory } from 'Database/factories/GameChangeLogFactory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await GameChangeLogFactory.createMany(20)
  }
}
