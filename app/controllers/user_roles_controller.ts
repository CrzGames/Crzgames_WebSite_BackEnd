import UserRole from '#models/user_role'
import UserRolesService from '#services/user_roles_service'
import { HttpContext } from '@adonisjs/core/http'

export default class UserRolesController {
  //function to get all user roles
  public async getAllUserRoles({ response }: HttpContext): Promise<void> {
    const userRoles: UserRole[] = await UserRolesService.getAllUserRoles()
    response.status(200).json(userRoles)
  }
}
