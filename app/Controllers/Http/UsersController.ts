import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UsersService from 'App/Services/UsersService'
import UpdateUsersRoleValidator from 'App/Validators/User/UpdateUsersRoleValidator'
import DeleteUsersValidator from 'App/Validators/User/DeleteUsersValidator'
import UpdateUsersValidator from 'App/Validators/User/UpdateUsersValidator'
import GetUsersByIdValidator from 'App/Validators/User/GetUsersByIdValidator'
import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {
  // Decode le token bearer token (envoyer dans le header 'Authorization' de la request) et retourne l'utilisateur
  private async decodeTokenReturnUser({ auth, response }: HttpContextContract): Promise<void> {
    const user: User = await UsersService.decodeTokenReturnUser(auth)
    response.status(200).json(user)
  }

  //function to get a user by id
  private async getUsersById({ response, request }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(GetUsersByIdValidator)
    const user: User = await UsersService.getUsersById(payload.id)
    response.status(200).json(user)
  }

  private async getVarsEnvironmentForUser({ response }: HttpContextContract): Promise<void> {
    const varsEnvironmentUser = {
      MERCURE_JWT_KEY: Env.get('MERCURE_JWT_KEY') as string,
      STRIPE_PUBLIC_KEY: Env.get('STRIPE_PUBLIC_KEY') as string,
    }

    response.json(varsEnvironmentUser)
  }

  //function to get all users
  private async getAllUsers({ response }: HttpContextContract): Promise<void> {
    const users: User[] = await UsersService.getAllUsers()
    response.status(200).json(users)
  }

  //function to update a user
  private async updateUsers({ request, response }: HttpContextContract): Promise<void> {
    const payload = await request.validate(UpdateUsersValidator)
    await UsersService.updateUsers(payload)
    response.status(204).noContent()
  }

  //function to delete a user
  private async deleteUsers({ request, response }: HttpContextContract): Promise<void> {
    const payload: { id: number } = await request.validate(DeleteUsersValidator)
    await UsersService.deleteUsers(payload.id)
    response.status(204).noContent()
  }

  //function to update user role
  private async updateUsersRole({ request, response }: HttpContextContract): Promise<void> {
    const payload: { userId: number; roleId: number } =
      await request.validate(UpdateUsersRoleValidator)
    await UsersService.updateUsersRole(payload.userId, payload.roleId)
    response.status(204).noContent()
  }

  private async getAllUsersByUsernameOrEmail({
    response,
    params,
  }: HttpContextContract): Promise<void> {
    const users: User[] = await UsersService.getAllUsersByUsernameOrEmail(params.usernameOrEmail)
    response.status(200).json(users)
  }
}
