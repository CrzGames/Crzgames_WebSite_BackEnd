import UserRole from 'App/Models/UserRole'
import UserRolesService from 'App/Services/UserRolesService'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserRolesController {
  //function to get all user roles
  private async getAllUserRoles({ response }: HttpContextContract): Promise<void> {
    const userRoles: UserRole[] = await UserRolesService.getAllUserRoles()
    response.status(200).json(userRoles)
  }
}
