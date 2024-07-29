import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteGameChangeLogValidator {
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
    'id.required': 'GameChangeLog ID is required',
    'id.number': 'GameChangeLog ID should be a number',
    'id.exists': 'GameChangeLog with this ID does not exist',
  }
}
