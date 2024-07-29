import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRole from 'App/Models/UserRole'
import { UserRoles } from 'App/Enums/UserRoles'

export default class UserRoleSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    for (const role in UserRoles) {
      const roleName: string = UserRoles[role]
      const data = { name: roleName }
      await UserRole.firstOrCreate({ name: data.name }, data)
    }
  }
}
