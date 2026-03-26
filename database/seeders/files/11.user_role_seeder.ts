import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserRole from '#models/user_role'
import { UserRoles } from '#enums/user_roles'

export default class UserRoleSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'development-remote', 'test', 'staging', 'production']

  public async run(): Promise<void> {
    for (const roleName of Object.values(UserRoles)) {
      const data = { name: roleName }
      await UserRole.firstOrCreate({ name: data.name }, data)
    }
  }
}
