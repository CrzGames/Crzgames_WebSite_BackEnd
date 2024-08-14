import User from 'App/Models/User'
import { UserRoles } from 'App/Enums/UserRoles'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export type UserIdAndRole = {
  id: number
  role: string
}

export default class UsersService {
  // Decode le token bearer token (envoyer dans le header 'Authorization' de la request) et retourne l'utilisateur
  public static async decodeTokenReturnUser(auth: AuthContract): Promise<User> {
    const user: User = await User.findOrFail(auth.user?.id)

    try {
      await user.load('userRole')
      return user
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getUsersById(userId: number): Promise<User> {
    try {
      return await User.findOrFail(userId)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getUserRoleById(userId: number): Promise<string> {
    try {
      const user: User = await User.query().where('id', userId).preload('userRole').firstOrFail()
      return user.userRole.name
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async isSupport(userId: number): Promise<boolean> {
    const userRole: string = await this.getUserRoleById(userId)
    return (
      userRole === UserRoles.ADMIN ||
      userRole === UserRoles.MODERATOR ||
      userRole === UserRoles.STAFF
    )
  }

  //function get all users email
  public static async getAllUsersEmail(): Promise<string[]> {
    try {
      const users: User[] = await User.all()

      if (!users || users.length === 0) {
        throw new NotFoundException('No User found')
      }

      return users.map((user: User) => user.email)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async updateUsers(payload: Record<string, any>): Promise<void> {
    const user: User = await User.findOrFail(payload.id)

    try {
      await user.merge(payload).save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async updateUsersRole(userId: number, roleId: number): Promise<void> {
    const user: User = await User.findOrFail(userId)

    try {
      await user.merge({ roles_id: roleId }).save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async deleteUsers(userId: number): Promise<void> {
    const user: User = await User.findOrFail(userId)

    try {
      await user.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  public static async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await User.query().preload('userRole')

      if (!users || users.length === 0) {
        throw new NotFoundException('No User found')
      }

      return users
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(error.message)
      }
    }
  }

  public static async getAllUsersByUsernameOrEmail(usernameOrEmail: string): Promise<User[]> {
    try {
      if (usernameOrEmail === '' || usernameOrEmail === undefined) {
        return this.getAllUsers()
      }

      return await User.query()
        .preload('userRole')
        .whereRaw('LOWER(username) LIKE ?', [`%${usernameOrEmail.toLowerCase()}%`])
        .orWhereRaw('LOWER(email) LIKE ?', [`%${usernameOrEmail.toLowerCase()}%`])
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  public static async getUserRoleAndIdByEmail(email: string): Promise<UserIdAndRole> {
    try {
      const user: User = await User.query().where('email', email).preload('userRole').firstOrFail()
      return { id: user.id, role: user.userRole.name } as UserIdAndRole
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
