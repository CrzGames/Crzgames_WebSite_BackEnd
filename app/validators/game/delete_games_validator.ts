import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class DeleteGamesValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'id.required': 'Game ID is required',
    'id.exists': 'Game does not exist',
  }
}
