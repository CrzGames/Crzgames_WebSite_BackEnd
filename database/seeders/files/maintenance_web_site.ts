import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MaintenanceWebSite from '#models/maintenance_web_site'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'development-remote', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    // Write your database queries here
    await MaintenanceWebSite.firstOrCreate(
      { name: 'crzgames-website-frontend' },
      { name: 'crzgames-website-frontend', isMaintenance: false },
    )
  }
}
