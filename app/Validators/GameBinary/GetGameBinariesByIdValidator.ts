import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetGameBinariesByIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'game_binaries', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'id.required': 'Game binary ID is required',
    'id.exists': 'Game binary does not exist',
  }
}
