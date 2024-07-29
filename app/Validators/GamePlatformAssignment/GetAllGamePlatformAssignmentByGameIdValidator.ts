import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllGamePlatformAssignmentByGameIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    gameId: schema.number([
      rules.required(),
      rules.exists({ table: 'game_platform_assignments', column: 'games_id' }),
    ]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'gameId.required': 'Game ID is required',
    'gameId.number': 'Game ID should be a number',
    'gameId.exists': 'No platform assignments for the game with this ID exist',
  }
}
