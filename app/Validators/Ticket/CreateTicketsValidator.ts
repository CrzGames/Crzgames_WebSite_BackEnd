import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateTicketsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    subject: schema.string([rules.required()]),
    description: schema.string([rules.required()]),
    statusId: schema.number([rules.required()]),
    categoryId: schema.number([
      rules.required(),
      rules.exists({ table: 'ticket_categories', column: 'id' }),
    ]),
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
  })
  public messages: CustomMessages = {}
}
