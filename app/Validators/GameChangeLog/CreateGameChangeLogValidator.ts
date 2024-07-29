import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateGameChangeLogValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    games_id: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
    version: schema.string([rules.required()]),
    content: schema.string([rules.required()]),
  })

  public messages: CustomMessages = {}
}
