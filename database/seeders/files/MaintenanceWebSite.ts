import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MaintenanceWebSite from 'App/Models/MaintenanceWebSite'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    // Write your database queries here
    await MaintenanceWebSite.firstOrCreate(
      { name: 'crzgames-website-frontend' },
      { name: 'crzgames-website-frontend', is_maintenance: false },
    )
  }
}
