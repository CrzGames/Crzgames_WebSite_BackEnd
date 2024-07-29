import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetGameChangeLogByIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([
      rules.required(),
      rules.exists({ table: 'game_change_logs', column: 'id' }),
    ]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'gameId.required': 'Game ID is required',
    'gameId.number': 'Game ID should be a number',
    'gameId.exists': 'Game with this ID does not exist',
  }
}
