import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TicketFactory } from 'Database/factories/TicketFactory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await TicketFactory.createMany(20)
  }
}
