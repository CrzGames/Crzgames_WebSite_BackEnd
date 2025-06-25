import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class CreateTicketResponsesValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    content: schema.string([rules.required()]),
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    ticketId: schema.number([rules.required(), rules.exists({ table: 'tickets', column: 'id' })]),
  })
  public messages: CustomMessages = {}
}
