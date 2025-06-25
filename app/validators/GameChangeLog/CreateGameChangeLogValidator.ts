import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class CreateGameChangeLogValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    games_id: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
    version: schema.string([rules.required()]),
    content: schema.string([rules.required()]),
  })

  public messages: CustomMessages = {}
}
