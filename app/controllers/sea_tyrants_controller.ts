import { HttpContext } from '@adonisjs/core/http'
import SeaTyrantsService from '#services/sea_tyrants_service'
import { UserIdAndRole } from '#services/users_service'
import GetInfoUserValidator from '#validators/sea_tyrants/get_info_user_validator'

export default class SeatyrantsController {
  public async getInfoUser({ response, request }: HttpContext): Promise<void> {
    const payload: { email: string } = await request.validate(GetInfoUserValidator)
    console.log('payload', payload)
    const userIdAndRole: UserIdAndRole = await SeaTyrantsService.getInfoUser(payload.email)
    response.status(200).json(userIdAndRole)
  }
}
