import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetGamesByIdValidator {
  constructor(protected ctx: HttpContextContract) {}

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
