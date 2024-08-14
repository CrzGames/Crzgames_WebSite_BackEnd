import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SeaTyrantsService from 'App/Services/SeaTyrantsService'
import { UserIdAndRole } from 'App/Services/UsersService'
import GetInfoUserValidator from 'App/Validators/SeaTyrants/GetInfoUserValidator'

export default class SeatyrantsController {
  private async getInfoUser({ response, request }: HttpContextContract): Promise<void> {
    const payload: { email: string } = await request.validate(GetInfoUserValidator)
    console.log('payload', payload)
    const userIdAndRole: UserIdAndRole = await SeaTyrantsService.getInfoUser(payload.email)
    response.status(200).json(userIdAndRole)
  }
}
