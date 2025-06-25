import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetUsersByIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'id.required': 'User ID is required',
    'id.exists': 'User does not exist',
  }
}
