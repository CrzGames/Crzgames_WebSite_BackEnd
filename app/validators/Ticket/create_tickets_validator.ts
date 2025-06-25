import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class CreateTicketsValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    subject: schema.string([rules.required()]),
    description: schema.string([rules.required()]),
    statusId: schema.number([rules.required()]),
    categoryId: schema.number([rules.required(), rules.exists({ table: 'ticket_categories', column: 'id' })]),
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
  })
  public messages: CustomMessages = {}
}
