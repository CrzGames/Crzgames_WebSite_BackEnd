import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TicketStatus from 'App/Models/TicketStatus'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

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
