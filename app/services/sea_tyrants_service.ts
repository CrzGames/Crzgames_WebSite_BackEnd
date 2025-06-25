import UsersService, { UserIdAndRole } from '#services/users_service'
import { InternalServerErrorException } from '#exceptions/internal_server_error_exception'

export default class SeaTyrantsService {
  public static async getInfoUser(email: string): Promise<UserIdAndRole> {
    try {
      return await UsersService.getUserRoleAndIdByEmail(email)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
