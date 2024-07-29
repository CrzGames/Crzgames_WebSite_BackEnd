import UserRole from 'App/Models/UserRole'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

export default class UserRolesService {
  //function to get all user roles
  public static async getAllUserRoles(): Promise<UserRole[]> {
    try {
      const userRoles: UserRole[] = await UserRole.all()

      if (!userRoles || userRoles.length === 0) {
        throw new NotFoundException('No UserRoles found')
      }

      return userRoles
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getUserRoleById(id: number): Promise<UserRole> {
    try {
      return await UserRole.findOrFail(id)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getUserRoleByName(name: string): Promise<UserRole> {
    try {
      return await UserRole.findByOrFail('name', name)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
