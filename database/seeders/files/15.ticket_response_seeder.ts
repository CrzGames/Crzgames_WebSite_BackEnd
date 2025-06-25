import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TicketResponseFactory } from '#database/factories/ticket_response_factory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    await TicketResponseFactory.createMany(20)
  }
}
