import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TicketFactory } from '#database/factories/ticket_factory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await TicketFactory.createMany(20)
  }
}
