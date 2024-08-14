import UsersService, { UserIdAndRole } from 'App/Services/UsersService'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

export default class SeaTyrantsService {
  public static async getInfoUser(email: string): Promise<UserIdAndRole> {
    try {
      return await UsersService.getUserRoleAndIdByEmail(email)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
