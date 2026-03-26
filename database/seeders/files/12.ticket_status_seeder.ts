import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TicketStatus from '#models/ticket_status'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'development-remote', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const statusesData = [
      {
        name: 'Open',
        description: 'The ticket is open',
      },
      {
        name: 'Pending',
        description: 'A response from a customer waiting for support',
      },
      {
        name: 'Closed',
        description: 'The issue is resolved',
      },
    ]

    for (const data of statusesData) {
      await TicketStatus.firstOrCreate({ name: data.name }, data)
    }
  }
}
