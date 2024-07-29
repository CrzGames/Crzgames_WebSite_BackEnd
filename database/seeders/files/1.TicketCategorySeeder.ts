import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TicketCategory from 'App/Models/TicketCategory'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    const categoriesData = [
      {
        name: 'Others',
      },
      {
        name: 'Launcher Connection Problem',
      },
      {
        name: 'Game Update Issue',
      },
      {
        name: 'Payment Issue',
      },
      {
        name: 'Game Installation Issue',
      },
      {
        name: 'Game Performance Issue',
      },
      {
        name: 'In-game Item Issue',
      },
      {
        name: 'Report a Bug',
      },
      {
        name: 'Refund Request',
      },
      {
        name: 'Game Functionality Query',
      },
      {
        name: 'Game Server Connection Issue',
      },
      {
        name: 'Others',
      },
    ]

    for (const data of categoriesData) {
      await TicketCategory.firstOrCreate({ name: data.name }, data)
    }
  }
}
