import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { TicketResponseFactory } from 'Database/factories/TicketResponseFactory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await TicketResponseFactory.createMany(20)
  }
}
