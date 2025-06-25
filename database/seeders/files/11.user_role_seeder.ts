import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRole from '#models/user_role'
import { UserRoles } from '#enums/user_roles'

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
