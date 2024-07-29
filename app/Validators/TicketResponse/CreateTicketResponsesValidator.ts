import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTicketResponsesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    content: schema.string([rules.required()]),
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    ticketId: schema.number([rules.required(), rules.exists({ table: 'tickets', column: 'id' })]),
  })
  public messages: CustomMessages = {}
}
