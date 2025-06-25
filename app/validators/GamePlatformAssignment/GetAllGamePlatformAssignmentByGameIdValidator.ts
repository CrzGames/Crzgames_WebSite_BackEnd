import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetAllGamePlatformAssignmentByGameIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    gameId: schema.number([rules.required(), rules.exists({ table: 'game_platform_assignments', column: 'games_id' })]),
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
