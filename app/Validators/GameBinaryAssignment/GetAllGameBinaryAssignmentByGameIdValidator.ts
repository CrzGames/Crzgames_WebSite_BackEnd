import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllGameBinaryAssignmentByGameIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    gameId: schema.number([
      rules.required(),
      rules.exists({ table: 'game_binary_assignments', column: 'games_id' }),
    ]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages: CustomMessages = {
    'gameId.required': 'Game ID is required',
    'gameId.number': 'Game ID should be a number',
    'gameId.exists': 'Game with this ID does not exist',
  }
}
