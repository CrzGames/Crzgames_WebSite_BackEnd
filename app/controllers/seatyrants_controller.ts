import type { HttpContext } from '@adonisjs/core/http'
import SeaTyrantsService from '#services/seatyrants_service'
import type { UserIdAndRole } from '#services/users_service'
import { getInfoUserValidator } from '#validators/SeaTyrants/GetInfoUserValidator'

export default class SeatyrantsController {
  public async getInfoUser({ response, request }: HttpContext): Promise<void> {
    const payload: { email: string } = await request.validateUsing(getInfoUserValidator)
    console.log('payload', payload)
    const userIdAndRole: UserIdAndRole = await SeaTyrantsService.getInfoUser(payload.email)
    response.status(200).json(userIdAndRole)
  }
}
