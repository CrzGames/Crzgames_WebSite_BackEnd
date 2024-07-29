import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetUsersByIdValidator {
  constructor(protected ctx: HttpContextContract) {}

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
