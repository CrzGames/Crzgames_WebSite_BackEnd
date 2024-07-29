import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetTicketsByIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'tickets', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'id.required': 'Ticket ID is required',
    'id.exists': 'Ticket does not exist',
  }
}
