import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UsersService from '#services/users_service'
import UpdateUsersRoleValidator from '#validators/user/update_users_role_validator'
import DeleteUsersValidator from '#validators/user/delete_users_validator'
import UpdateUsersValidator from '#validators/user/update_users_validator'
import GetUsersByIdValidator from '#validators/user/get_users_by_id_validator'
import env from '#start/env'

export default class UsersController {
  // Decode le token bearer token (envoyer dans le header 'Authorization' de la request) et retourne l'utilisateur
  public async decodeTokenReturnUser({ auth, response }: HttpContext): Promise<void> {
    const user: User = await UsersService.decodeTokenReturnUser(auth)
    response.status(200).json(user)
  }

  //function to get a user by id
  public async getUsersById({ response, request }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(GetUsersByIdValidator)
    const user: User = await UsersService.getUsersById(payload.id)
    response.status(200).json(user)
  }

  public async getVarsEnvironmentForUser({ response }: HttpContext): Promise<void> {
    const varsEnvironmentUser = {
      MERCURE_JWT_KEY: env.get('MERCURE_JWT_KEY') as string,
      STRIPE_PUBLIC_KEY: env.get('STRIPE_PUBLIC_KEY') as string,
    }

    response.json(varsEnvironmentUser)
  }

  //function to get all users
  public async getAllUsers({ response }: HttpContext): Promise<void> {
    const users: User[] = await UsersService.getAllUsers()
    response.status(200).json(users)
  }

  //function to update a user
  public async updateUsers({ request, response }: HttpContext): Promise<void> {
    const payload = await request.validate(UpdateUsersValidator)
    await UsersService.updateUsers(payload)
    response.status(204).noContent()
  }

  //function to delete a user
  public async deleteUsers({ request, response }: HttpContext): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteUsersValidator)
    await UsersService.deleteUsers(payload.id)
    response.status(204).noContent()
  }

  //function to update user role
  public async updateUsersRole({ request, response }: HttpContext): Promise<void> {
    const payload: { userId: number; roleId: number } = await request.validate(UpdateUsersRoleValidator)
    await UsersService.updateUsersRole(payload.userId, payload.roleId)
    response.status(204).noContent()
  }

  public async getAllUsersByUsernameOrEmail({ response, params }: HttpContext): Promise<void> {
    const users: User[] = await UsersService.getAllUsersByUsernameOrEmail(params.usernameOrEmail)
    response.status(200).json(users)
  }
}
